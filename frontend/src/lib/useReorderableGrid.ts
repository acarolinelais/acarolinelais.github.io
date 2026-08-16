import { useEffect, useState } from 'react'

// In-memory only, on purpose — a reload always goes back to the site's
// default card arrangement (no localStorage), the dragged arrangement is
// just for that visit.
//
// `columnOrder` is an array of columns, each a list of card ids — this is
// what lets Home/Skills lay cards out as independent-height masonry
// columns (see useMasonryLayout) while still supporting one card being
// dragged into a completely different column.
export function useReorderableColumns(initialColumns: string[][]) {
  const [columnOrder, setColumnOrder] = useState(initialColumns)

  // Stable, content-based dependency — initialColumns is a fresh array
  // reference from the page's useMemo on every render.
  const columnsKey = initialColumns.map((col) => col.join(',')).join('|')

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
    // stable, content-based version of the same dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnsKey])

  function moveItem(draggedId: string, targetId: string) {
    if (draggedId === targetId) return

    setColumnOrder((current) => {
      const next = current.map((col) => col.slice())

      let removed = false
      for (const col of next) {
        const i = col.indexOf(draggedId)
        if (i !== -1) {
          col.splice(i, 1)
          removed = true
          break
        }
      }
      if (!removed) return current

      for (const col of next) {
        const i = col.indexOf(targetId)
        if (i !== -1) {
          col.splice(i, 0, draggedId)
          return next
        }
      }

      return current
    })
  }

  return { columnOrder, moveItem }
}
