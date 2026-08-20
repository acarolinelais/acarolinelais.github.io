import { motion, useMotionValue } from 'framer-motion'
import type { PanInfo } from 'framer-motion'
import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { flushSync } from 'react-dom'

import { scrollDownVariants } from '@/lib/pageTransitions'
import { useReorderableColumns } from '@/lib/useReorderableGrid'

/**
 * A per-breakpoint value: either a constant, or a function of how many
 * columns the grid is currently rendering (2, 3 or 4 — see
 * `getColumnCount`). The function form exists because a card's *proportions*
 * often need to change with the breakpoint, not just its size — a wide map
 * strip that reads well at 4 columns is an unusable sliver at 2.
 */
type Responsive<T> = T | ((columnCount: number) => T)

function resolve<T>(value: Responsive<T>, columnCount: number): T {
  return typeof value === 'function' ? (value as (c: number) => T)(columnCount) : value
}

export interface CardSlot {
  id: string
  /**
   * width / height, always relative to a single column's width — e.g. 1 for
   * square, 0.75 for taller-than-wide. Independent of `colSpan`: a spanning
   * card gets *wider* (not taller) than a same-ratio single-column card.
   */
  aspectRatio: Responsive<number>
  /**
   * How many of its home column plus the columns to its right this card
   * claims (default 1). To span, list the *same* CardSlot (reuse the object,
   * don't just repeat the id) in both of its home columns' arrays, at the
   * point in each where the shared row should land — see the
   * `map`/`project-byterise` slots in Home.tsx.
   *
   * Spanning is only reliable when the card's two home columns still land in
   * *adjacent* buckets after the fold-down in `computeLayout` — which depends
   * on both the column count and which logical columns the card lives in. Use
   * the function form to opt out at the breakpoints where that isn't true (or
   * where a full-width card just isn't wanted); a span that can't be honoured
   * degrades to a single-column card rather than breaking the layout, but
   * saying so explicitly keeps the result predictable.
   */
  colSpan?: Responsive<number>
  render: () => ReactNode
}

type Rect = { left: number; top: number; width: number; height: number }

interface DropTarget {
  columnIndex: number
  insertIndex: number
}

interface GridContextValue {
  nodesRef: React.RefObject<Map<string, HTMLDivElement>>
  moveItem: (draggedId: string, columnIndex: number, insertIndex: number) => void
  resolveDropTarget: (draggedId: string, viewportX: number, viewportY: number) => DropTarget | null
  hasEntered: boolean
  draggingId: string | null
  setDraggingId: (id: string | null) => void
}

const GridContext = createContext<GridContextValue | null>(null)

function useGridContext() {
  const ctx = useContext(GridContext)
  if (!ctx) {
    throw new Error('ReorderableGridItem must be rendered inside ReorderableGrid')
  }
  return ctx
}

function getColumnCount(width: number): number {
  if (width >= 1024) return 4
  if (width >= 640) return 3
  return 2
}

function getGap(width: number): number {
  if (width >= 1024) return 32
  if (width >= 640) return 24
  return 16
}

// True masonry (independent column heights, computed from each card's own
// aspect-ratio) rather than CSS grid/flex — deliberately. Two things ruled
// those out: a CSS grid with a fixed row height silently lets a card
// overflow into the row below when its aspect-ratio makes it taller than
// that row (a real bug this replaced); and rendering each column as its
// own flex `<div>` would mean React unmounts/remounts a card's DOM node
// entirely when it's dragged into a *different* column (moving a keyed
// child between different parent elements isn't a reorder as far as
// React's reconciler is concerned) — killing the drag gesture and any
// in-flight Framer state mid-drag. Computing pixel positions here keeps
// every card a permanent sibling in one flat container regardless of
// which column it's currently in, so dragging across columns is just a
// style change, never a remount.
function computeLayout(
  containerWidth: number,
  columnOrder: string[][],
  slotsById: Map<string, CardSlot>,
): { positions: Map<string, Rect>; height: number; columnCount: number; buckets: string[][] } {
  const columnCount = getColumnCount(containerWidth)
  // Before the first measurement there's nothing meaningful to lay out, and
  // a zero width would otherwise produce negative column widths.
  if (containerWidth <= 0) return { positions: new Map(), height: 0, columnCount, buckets: [] }

  const gap = getGap(containerWidth)
  const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount

  // Redistribute the (up to 4) logical columns into however many actually
  // fit at this breakpoint, preserving each logical column's internal order.
  const buckets: string[][] = Array.from({ length: columnCount }, () => [])
  columnOrder.forEach((col, i) => {
    buckets[i % columnCount].push(...col)
  })

  const positions = new Map<string, Rect>()
  const cumulativeY = new Array(columnCount).fill(0)

  // A spanning card's id was pushed into more than one bucket (its home
  // column, plus one entry per extra column it reaches into — see
  // CardSlot.colSpan). Buckets are drained left-to-right in lockstep passes
  // rather than one bucket fully before the next, because a spanning card
  // can only be placed once *every* column it spans has caught up to it —
  // its own bucket's cursor reaching it doesn't mean a neighbor's earlier,
  // non-spanning cards have already been placed. Each pass places whatever
  // is currently placeable and loops until nothing moves.
  const pointers = new Array(columnCount).fill(0)
  const anyRemaining = () => pointers.some((p, c) => p < buckets[c].length)

  // Stall-breaker. A spanning card can only be placed once every column it
  // reaches into has caught up to it, so a card whose home columns *don't*
  // end up adjacent after the fold above can never become ready — and it
  // would block its whole bucket behind it, leaving those cards with no
  // position and therefore rendering nothing at all. If a full pass places
  // nothing while cards are still queued, the next pass demotes spans to 1
  // so the stuck heads go down as ordinary cards. Reset as soon as anything
  // moves, so cards later in the queue can still span.
  let relaxSpans = false
  while (anyRemaining()) {
    let progressed = false
    for (let c = 0; c < columnCount; c++) {
      const bucket = buckets[c]
      if (pointers[c] >= bucket.length) continue
      const id = bucket[pointers[c]]

      // Already placed via another spanned column catching up to the same
      // id in an earlier pass — just consume this column's reference to it.
      if (positions.has(id)) {
        pointers[c]++
        progressed = true
        continue
      }

      // A card can only rightfully start its span at the *leftmost* column
      // currently pointing at it. Without this check, two spanning cards
      // stacked back-to-back with nothing single-column between them (e.g.
      // both cards spanning the same column pair, one right after the
      // other) break: placing the first span advances *both* of its
      // columns' pointers in the same pass, so by the time this loop
      // reaches the second (rightmost) of those columns later in that same
      // pass, its pointer already sits on the next card — and this column
      // would start that card's span here, one column late, instead of
      // waiting for the left column's turn (next pass) to start it
      // correctly. That produced a real bug: the card silently rendered
      // one column over from where its own span math intended, no longer
      // spanning at all.
      let leftmost = c
      for (let sc = 0; sc < c; sc++) {
        if (buckets[sc][pointers[sc]] === id) {
          leftmost = sc
          break
        }
      }
      if (leftmost !== c) continue

      const slot = slotsById.get(id)
      if (!slot) {
        pointers[c]++
        progressed = true
        continue
      }

      const span = relaxSpans
        ? 1
        : Math.min(resolve(slot.colSpan ?? 1, columnCount), columnCount - c)
      const spanCols = Array.from({ length: span }, (_, k) => c + k)
      const ready = spanCols.every((sc) => buckets[sc][pointers[sc]] === id)
      if (!ready) continue

      // Height is always derived from a single column's width — spanning
      // makes a card wider, never taller — while width grows with the span.
      const width = columnWidth * span + gap * (span - 1)
      const height = columnWidth / resolve(slot.aspectRatio, columnCount)
      const top = Math.max(...spanCols.map((sc) => cumulativeY[sc]))
      positions.set(id, { left: c * (columnWidth + gap), top, width, height })
      spanCols.forEach((sc) => {
        cumulativeY[sc] = top + height + gap
        pointers[sc]++
      })
      progressed = true
    }

    if (progressed) {
      relaxSpans = false
      continue
    }
    // Nothing moved. One retry with spans demoted; if that also places
    // nothing the queue is genuinely unplaceable, so stop rather than spin.
    if (relaxSpans) break
    relaxSpans = true
  }

  const height = columnWidth > 0 ? Math.max(0, ...cumulativeY.map((y) => y - gap)) : 0
  return { positions, height, columnCount, buckets }
}

interface ReorderableGridProps {
  /**
   * Either one fixed set of logical columns — which gets folded down into
   * however many physically fit (see `computeLayout`) — or a function
   * returning the arrangement to use at a given column count.
   *
   * The function form exists because folding is a reasonable default but not
   * a design: it can only ever merge whole columns end-to-end, so it can't
   * express "on a 3-column screen this card moves next to that one". A page
   * that has an actual design per breakpoint should return exactly
   * `columnCount` columns and get them used verbatim.
   */
  columns: CardSlot[][] | ((columnCount: number) => CardSlot[][])
}

export function ReorderableGrid({ columns }: ReorderableGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef(new Map<string, HTMLDivElement>())

  // Measured width drives everything downstream, including *which*
  // arrangement is in play — so it has to be state, resolved before the
  // columns are.
  const [containerWidth, setContainerWidth] = useState(0)
  const columnCount = getColumnCount(containerWidth)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    function measure() {
      if (el) setContainerWidth(el.offsetWidth)
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const resolvedColumns = useMemo(
    () => (typeof columns === 'function' ? columns(columnCount) : columns),
    [columns, columnCount],
  )

  const slotsById = useMemo(
    () => new Map(resolvedColumns.flat().map((slot) => [slot.id, slot])),
    [resolvedColumns],
  )
  const initialColumnOrder = useMemo(
    () => resolvedColumns.map((col) => col.map((slot) => slot.id)),
    [resolvedColumns],
  )
  const getSpan = useCallback(
    (id: string) => resolve(slotsById.get(id)?.colSpan ?? 1, columnCount),
    [slotsById, columnCount],
  )

  // Crossing a breakpoint swaps in a different arrangement, which has to
  // replace any dragged order outright rather than be merged into it.
  const { columnOrder, moveItem } = useReorderableColumns(initialColumnOrder, columnCount, getSpan)

  const layout = useMemo(
    () => computeLayout(containerWidth, columnOrder, slotsById),
    [containerWidth, columnOrder, slotsById],
  )

  const totalCount = slotsById.size

  // Gates `layout`/`drag` on every item until the page's own entrance
  // stagger has fully played out, so layout measurement never runs
  // mid-entrance and fights the mount spring in pageTransitions.ts. A
  // timer (not onAnimationComplete) because these entrance wrappers only
  // ever get their `y` target via variant *propagation* from the page's
  // root motion.div (no explicit `animate` prop of their own, to keep
  // pageTransitions.ts's existing stagger untouched) — Framer Motion
  // doesn't reliably fire onAnimationComplete for a propagated-only
  // target, only for a component's own explicit animate.
  //
  // Mirrors gridVariants' delayChildren (50ms) + staggerChildren (35ms) —
  // when the ms/step here drifts from that file's seconds/step, the last
  // card's spring is still mid-flight when this fires, so layout/drag turn
  // on and immediately fight it. The +250ms is settle time for that last
  // card's own entrance spring (scrollDownVariants — tightened to match the
  // exit spring, so 250ms comfortably covers it now).
  const [hasEntered, setHasEntered] = useState(false)
  useEffect(() => {
    const entranceMs = 50 + totalCount * 35 + 250
    const id = setTimeout(() => setHasEntered(true), entranceMs)
    return () => clearTimeout(id)
  }, [totalCount])

  const [draggingId, setDraggingId] = useState<string | null>(null)

  // Turns "where the dragged card visually is" into a column + position,
  // rather than requiring it to land on top of another card's DOM node (see
  // the note on moveItem in useReorderableGrid.ts for why that requirement
  // was the bug: a column with little content had empty space nothing could
  // be dropped onto). `columnIndex` here is a *logical* column-order index —
  // correct as long as the grid's arrangement returns exactly `columnCount`
  // columns per breakpoint, which every current caller does (see the
  // `columns` prop doc below); it would need to account for `computeLayout`'s
  // fold if a caller ever relied on that instead.
  const resolveDropTarget = useCallback(
    (draggedId: string, viewportX: number, viewportY: number): DropTarget | null => {
      const containerEl = containerRef.current
      if (!containerEl || containerWidth <= 0 || layout.columnCount <= 0) return null

      const containerRect = containerEl.getBoundingClientRect()
      const x = viewportX - containerRect.left
      const y = viewportY - containerRect.top

      const gap = getGap(containerWidth)
      const colWidth = (containerWidth - gap * (layout.columnCount - 1)) / layout.columnCount
      const columnIndex = Math.min(
        Math.max(Math.floor(x / (colWidth + gap)), 0),
        layout.columnCount - 1,
      )

      const bucket = (layout.buckets[columnIndex] ?? []).filter((otherId) => otherId !== draggedId)
      let insertIndex = bucket.length
      for (let i = 0; i < bucket.length; i++) {
        const otherRect = layout.positions.get(bucket[i])
        if (!otherRect) continue
        if (y < otherRect.top + otherRect.height / 2) {
          insertIndex = i
          break
        }
      }

      return { columnIndex, insertIndex }
    },
    [containerWidth, layout],
  )

  return (
    <GridContext.Provider
      value={{ nodesRef, moveItem, resolveDropTarget, hasEntered, draggingId, setDraggingId }}
    >
      <div ref={containerRef} className="relative w-full" style={{ height: layout.height }}>
        {/* A spanning card's id is intentionally listed in more than one
            column (see CardSlot.colSpan) so computeLayout can sync those
            columns' heights — dedupe here so it still renders once. */}
        {Array.from(new Set(columnOrder.flat())).map((id) => {
          const slot = slotsById.get(id)
          const rect = layout.positions.get(id)
          if (!slot || !rect) return null
          return (
            <ReorderableGridItem key={id} id={id} rect={rect}>
              {slot.render()}
            </ReorderableGridItem>
          )
        })}
      </div>
    </GridContext.Provider>
  )
}

interface ReorderableGridItemProps {
  id: string
  rect: Rect
  children: ReactNode
}

function ReorderableGridItem({ id, rect, children }: ReorderableGridItemProps) {
  const { nodesRef, moveItem, resolveDropTarget, hasEntered, draggingId, setDraggingId } =
    useGridContext()
  const lastTargetRef = useRef<string | null>(null)
  const isDragging = draggingId === id
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const grabOffsetRef = useRef({ x: 0, y: 0 })
  // Set once at drag start, cleared at drag end — while set, this item
  // renders `position: fixed` at its captured size, fully outside normal
  // flow, so reordering mid-drag (which recomputes every *other* item's
  // masonry position) can never also move *this* one out from under its
  // own pointer-tracking transform.
  const [fixedSize, setFixedSize] = useState<{ width: number; height: number } | null>(null)

  const setNode = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) nodesRef.current.set(id, node)
      else nodesRef.current.delete(id)
    },
    [id, nodesRef],
  )

  function handleDragStart(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const node = nodesRef.current.get(id)
    if (node) {
      const r = node.getBoundingClientRect()
      grabOffsetRef.current = { x: info.point.x - r.left, y: info.point.y - r.top }
      // flushSync forces the position:fixed commit to land in the DOM before
      // x/y (a Framer motion value, written outside React's render cycle)
      // gets set below. Without it the two updates race: x/y could apply for
      // one frame while the node was still relatively positioned, translating
      // it by a full viewport offset and producing a visible jump on pickup.
      flushSync(() => {
        setFixedSize({ width: r.width, height: r.height })
        setDraggingId(id)
      })
      x.set(r.left)
      y.set(r.top)
    } else {
      setDraggingId(id)
    }
  }

  function handleDrag(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const nextX = info.point.x - grabOffsetRef.current.x
    const nextY = info.point.y - grabOffsetRef.current.y
    x.set(nextX)
    y.set(nextY)

    if (!fixedSize) return
    // Resolved from the dragged card's own center, not the raw pointer —
    // the grab point can sit anywhere inside the card (or, for a two-column
    // card, well off to one side of its own center).
    const target = resolveDropTarget(id, nextX + fixedSize.width / 2, nextY + fixedSize.height / 2)
    if (!target) return
    const key = `${target.columnIndex}:${target.insertIndex}`
    if (key !== lastTargetRef.current) {
      lastTargetRef.current = key
      moveItem(id, target.columnIndex, target.insertIndex)
    }
  }

  function handleDragEnd() {
    // Same ordering hazard as handleDragStart, in reverse: layout must be
    // re-enabled (fixedSize cleared) before x/y snap back to 0, or Framer's
    // FLIP snapshot for the drop-into-place animation gets taken against the
    // wrong (still-fixed) box and the card visibly teleports before easing in.
    flushSync(() => {
      setDraggingId(null)
      setFixedSize(null)
    })
    lastTargetRef.current = null
    x.set(0)
    y.set(0)
  }

  // Belt-and-suspenders: if the pointer is released in a way Framer's own
  // onDragEnd doesn't catch, this card would otherwise stay stuck
  // mid-drag — fixed-positioned, sitting on top of whatever it was last
  // over. A window-level listener forces the same cleanup regardless of
  // whether Framer's own handler ran.
  useEffect(() => {
    if (!isDragging) return

    function forceEnd() {
      handleDragEnd()
    }

    window.addEventListener('pointerup', forceEnd)
    window.addEventListener('pointercancel', forceEnd)
    return () => {
      window.removeEventListener('pointerup', forceEnd)
      window.removeEventListener('pointercancel', forceEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  return (
    <motion.div
      variants={scrollDownVariants}
      className="absolute"
      style={{
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        // Corner radius as a proportion of the card rather than of the
        // viewport, so a card looks equally rounded at every breakpoint —
        // a flat 4rem reads as a soft squircle on a 260px desktop card and
        // as a lozenge on a 130px phone one. Capped by height as well as
        // width so short wide cards (the map) don't round into a pill.
        // Inherited by everything inside, including the border-ring overlay
        // and NowPlayingCard's concentric inner corners.
        ['--radius-card' as string]: `${Math.min(64, rect.width * 0.24, rect.height * 0.3)}px`,
      }}
    >
      <motion.div
        ref={setNode}
        // The item being dragged skips `layout` — it's driven entirely by
        // the fixed-position pointer tracking above. Siblings keep
        // `layout="position"` so *they* reflow smoothly into their newly
        // computed masonry position.
        layout={hasEntered && !isDragging ? 'position' : false}
        drag={hasEntered}
        dragMomentum={false}
        whileDrag={{ scale: 1.03 }}
        // Explicit rather than Framer's defaults: a slightly underdamped
        // spring for the reflow (settles without a visible bounce-back, which
        // read as a glitch when a card overshot then snapped past its target)
        // and a quick, non-springy tween for the pickup scale, so grabbing a
        // card feels immediate instead of wobbling up to 1.03x.
        transition={{
          layout: { type: 'spring', stiffness: 500, damping: 40 },
          scale: { duration: 0.15, ease: 'easeOut' },
        }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          x,
          y,
          zIndex: isDragging ? 20 : 0,
          ...(fixedSize
            ? { position: 'fixed' as const, left: 0, top: 0, width: fixedSize.width, height: fixedSize.height }
            : {}),
        }}
        className="relative size-full touch-none"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
