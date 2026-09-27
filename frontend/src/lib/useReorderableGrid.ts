import { useEffect, useState } from 'react'

/**
 * Dragged card order, per column, kept in memory only (a reload restores the
 * default). A change in `resetKey` (a breakpoint crossing) replaces the order
 * outright; otherwise added/removed cards are merged into it.
 */
export function useReorderableColumns(
  initialColumns: string[][],
  resetKey: unknown,
  getSpan: (id: string) => number,
) {
  const [columnOrder, setColumnOrder] = useState(initialColumns)
  const [lastResetKey, setLastResetKey] = useState(resetKey)

  // initialColumns is a new array every render; this is its stable key.
  const columnsKey = initialColumns.map((col) => col.join(',')).join('|')

  // Reset during render, not in an effect, to avoid a frame with the old order.
  if (lastResetKey !== resetKey) {
    setLastResetKey(resetKey)
    setColumnOrder(initialColumns)
  }

  // Keeps known cards in place, appends new ones to their default column and
  // drops removed ones.
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
  }, [columnsKey])

  // A spanning card is listed once per column it covers, so every occurrence
  // is removed and it is re-listed across its span.
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
