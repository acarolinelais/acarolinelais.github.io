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

// A constant, or a function of the current column count (2, 3 or 4).
type Responsive<T> = T | ((columnCount: number) => T)

function resolve<T>(value: Responsive<T>, columnCount: number): T {
  return typeof value === 'function' ? (value as (c: number) => T)(columnCount) : value
}

export interface CardSlot {
  id: string
  /** width / height of a single column; spanning makes a card wider, not taller. */
  aspectRatio: Responsive<number>
  /**
   * Columns claimed from its home column rightwards (default 1). To span,
   * list the same CardSlot object in each of those columns' arrays. A span
   * that can't be honoured falls back to a single column.
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

// Absolute pixel positions instead of CSS grid/flex columns: every card stays
// a sibling in one container, so dragging it to another column is a style
// change rather than a remount that would kill the drag gesture.
function computeLayout(
  containerWidth: number,
  columnOrder: string[][],
  slotsById: Map<string, CardSlot>,
): { positions: Map<string, Rect>; height: number; columnCount: number; buckets: string[][] } {
  const columnCount = getColumnCount(containerWidth)
  if (containerWidth <= 0) return { positions: new Map(), height: 0, columnCount, buckets: [] }

  const gap = getGap(containerWidth)
  const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount

  // Folds the logical columns into however many fit, keeping their order.
  const buckets: string[][] = Array.from({ length: columnCount }, () => [])
  columnOrder.forEach((col, i) => {
    buckets[i % columnCount].push(...col)
  })

  const positions = new Map<string, Rect>()
  const cumulativeY = new Array(columnCount).fill(0)

  // Buckets are drained in lockstep passes: a spanning card can only be
  // placed once every column it spans has reached it.
  const pointers = new Array(columnCount).fill(0)
  const anyRemaining = () => pointers.some((p, c) => p < buckets[c].length)

  // If a pass places nothing (a span whose columns never line up), the next
  // pass demotes spans to 1 so the queue doesn't stall.
  let relaxSpans = false
  while (anyRemaining()) {
    let progressed = false
    for (let c = 0; c < columnCount; c++) {
      const bucket = buckets[c]
      if (pointers[c] >= bucket.length) continue
      const id = bucket[pointers[c]]

      // Already placed from another spanned column.
      if (positions.has(id)) {
        pointers[c]++
        progressed = true
        continue
      }

      // A span starts at the leftmost column pointing at the card, otherwise
      // back-to-back spanning cards start one column late.
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
    if (relaxSpans) break
    relaxSpans = true
  }

  const height = columnWidth > 0 ? Math.max(0, ...cumulativeY.map((y) => y - gap)) : 0
  return { positions, height, columnCount, buckets }
}

interface ReorderableGridProps {
  /**
   * Logical columns (folded into however many fit), or a function returning
   * exactly `columnCount` columns for a per-breakpoint arrangement.
   */
  columns: CardSlot[][] | ((columnCount: number) => CardSlot[][])
}

export function ReorderableGrid({ columns }: ReorderableGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef(new Map<string, HTMLDivElement>())

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

  const { columnOrder, moveItem } = useReorderableColumns(initialColumnOrder, columnCount, getSpan)

  const layout = useMemo(
    () => computeLayout(containerWidth, columnOrder, slotsById),
    [containerWidth, columnOrder, slotsById],
  )

  const totalCount = slotsById.size

  // Enables layout/drag only after the entrance stagger has played out, so
  // they don't fight it. A timer because Framer doesn't reliably fire
  // onAnimationComplete for propagated variants. Mirrors gridVariants'
  // delayChildren (50ms) + staggerChildren (35ms), plus 250ms settle time.
  const [hasEntered, setHasEntered] = useState(false)
  useEffect(() => {
    const entranceMs = 50 + totalCount * 35 + 250
    const id = setTimeout(() => setHasEntered(true), entranceMs)
    return () => clearTimeout(id)
  }, [totalCount])

  const [draggingId, setDraggingId] = useState<string | null>(null)

  // Maps a point to a column + insert position, so a drop can land anywhere,
  // including empty space below a column. Assumes the arrangement has exactly
  // `columnCount` columns (no fold).
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
        {/* Spanning cards are listed in several columns; render them once. */}
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
  // While dragging, the item is position: fixed at this size, so reflowing
  // the other cards never moves it out from under the pointer.
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
      // position: fixed must reach the DOM before x/y are set, or the card
      // jumps for a frame on pickup.
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
    // From the card's center, not the pointer.
    const target = resolveDropTarget(id, nextX + fixedSize.width / 2, nextY + fixedSize.height / 2)
    if (!target) return
    const key = `${target.columnIndex}:${target.insertIndex}`
    if (key !== lastTargetRef.current) {
      lastTargetRef.current = key
      moveItem(id, target.columnIndex, target.insertIndex)
    }
  }

  function handleDragEnd() {
    // Clear fixedSize before resetting x/y, or the drop animation starts from
    // the wrong box.
    flushSync(() => {
      setDraggingId(null)
      setFixedSize(null)
    })
    lastTargetRef.current = null
    x.set(0)
    y.set(0)
  }

  // Fallback for releases Framer's onDragEnd misses, which would leave the
  // card stuck mid-drag.
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
        // Radius proportional to the card, so it looks equally rounded at
        // every size.
        ['--radius-card' as string]: `${Math.min(64, rect.width * 0.24, rect.height * 0.3)}px`,
      }}
    >
      <motion.div
        ref={setNode}
        layout={hasEntered && !isDragging ? 'position' : false}
        drag={hasEntered}
        dragMomentum={false}
        whileDrag={{ scale: 1.02 }}
        transition={{
          layout: { type: 'spring', stiffness: 300, damping: 34, mass: 1 },
          scale: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
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
        className="card-fade relative size-full touch-none"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
