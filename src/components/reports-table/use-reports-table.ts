"use client"

import * as React from "react"

import { DEFAULT_SORT_DIRECTION, DEFAULT_SORT_KEY } from "./constants"
import { filterRows, sortRows } from "./logic"
import { type ReportRow, type SortDirection, type SortKey } from "./types"

export function useReportsTable(rows: ReportRow[]) {
  const [query, setQuery] = React.useState("")
  const [sortKey, setSortKey] = React.useState<SortKey>(DEFAULT_SORT_KEY)
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>(DEFAULT_SORT_DIRECTION)

  const filteredRows = React.useMemo(() => filterRows(rows, query), [query, rows])

  const sortedRows = React.useMemo(
    () => sortRows(filteredRows, sortKey, sortDirection),
    [filteredRows, sortDirection, sortKey]
  )

  const handleSort = React.useCallback((key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      return
    }

    setSortKey(key)
    setSortDirection(key === "ba_date" ? "desc" : "asc")
  }, [sortKey])

  return {
    query,
    setQuery,
    sortKey,
    sortDirection,
    sortedRows,
    handleSort,
  }
}
