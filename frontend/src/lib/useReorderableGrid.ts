import { useEffect, useState } from 'react'

// In-memory only, on purpose — a reload always goes back to the site's
// default card arrangement (no localStorage), the dragged arrangement is
// just for that visit.
//
// `columnOrder` is an array of columns, each a list of card ids — this is
// what lets Home/Skills lay cards out as independent-height masonry
// columns (see useMasonryLayout) while still supporting one card being
// dragged into a completely different column.
/**
 * `resetKey` distinguishes the two reasons `initialColumns` can change.
 * When it's unchanged, the incoming columns are the same arrangement with
 * cards possibly added or removed, so a dragged order is worth preserving.
 * When it changes, the caller has switched to a *different* arrangement
 * (a breakpoint crossing) — merging a 4-column dragged order into a
 * 3-column design would strand cards in a column that no longer exists, so
 * the new arrangement replaces the old one wholesale.
 */
export function useReorderableColumns(
  initialColumns: string[][],
  resetKey: unknown,
  getSpan: (id: string) => number,
) {
  const [columnOrder, setColumnOrder] = useState(initialColumns)
  const [lastResetKey, setLastResetKey] = useState(resetKey)

  // Stable, content-based dependency — initialColumns is a fresh array
  // reference from the page's useMemo on every render.
  const columnsKey = initialColumns.map((col) => col.join(',')).join('|')

  // Adjusted during render rather than in an effect (React's documented
  // pattern for resetting state when an input changes): the arrangement and
  // the column count change in the same commit, so an effect would let one
  // frame paint the *previous* breakpoint's column order against the new
  // breakpoint's card set — a visible flash of a half-empty grid.
  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey)
    setColumnOrder(initialColumns)
  }

  // Keeps a dragged arrangement intact across re-renders while still
  // picking up cards that appear/disappear later (e.g. project data
  // arriving after the initial fallback render): anything still known
  // stays where it is, anything new is appended to its default column,
  // anything gone is dropped.
  useEffect(() => {
    setColumnOrder((current) => {
      const known = new Set(initialColumns.flat())
      const next = current.map((col) => col.filter((id) => known.has(id)))

      initialColumns.forEach((col, i) => {
        col.forEach((id) => {
          if (!next.flat().includes(id)) next[i]?.push(id)
        })
      })

      const isSame =
        next.length === current.length &&
        next.every((col, i) => col.length === current[i]?.length && col.every((id, j) => id === current[i]?.[j]))
      return isSame ? current : next
    })
    // initialColumns itself is intentionally omitted — columnsKey is the
    // stable, content-based version of the same dependency. resetKey isn't
    // a dependency either: it's fully handled during render above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsKey])

  // Geometric rather than target-id-based: the caller (ReorderableGrid)
  // resolves *where the dragged card visually is* into a column index plus a
  // position within it, so a drop always lands somewhere — including an
  // empty column, or the empty space below a column's last card — instead of
  // requiring the pointer to land exactly on top of another card's DOM
  // node. That requirement is what made columns with few or short cards
  // (e.g. a 2- or 3-column layout with a lot of empty space beneath)
  // effectively undroppable: hovering the gap below the last card had
  // nothing to register as a target against, so the move silently never
  // fired.
  //
  // A spanning card's id is listed once per column it reaches into (see
  // CardSlot.colSpan / computeLayout in ReorderableGrid), so moving one has
  // to drop *every* occurrence and re-list it across however many columns,
  // starting at the resolved column, its span still claims — not just splice
  // a single id in one column the way a plain 1-wide card does.
  function moveItem(draggedId: string, columnIndex: number, insertIndex: number) {
    setColumnOrder((current) => {
      const next = current.map((col) => col.slice())

      let removedAny = false
      for (const col of next) {
        let i = col.indexOf(draggedId)
        while (i !== -1) {
          col.splice(i, 1)
          removedAny = true
          i = col.indexOf(draggedId)
        }
      }
      if (!removedAny) return current

      const anchor = Math.min(Math.max(columnIndex, 0), next.length - 1)
      const span = Math.min(Math.max(1, getSpan(draggedId)), next.length - anchor)
      for (let k = 0; k < span; k++) {
        const col = next[anchor + k]
        const idx = Math.min(Math.max(insertIndex, 0), col.length)
        col.splice(idx, 0, draggedId)
      }

      return next
    })
  }

  return { columnOrder, moveItem }
}
