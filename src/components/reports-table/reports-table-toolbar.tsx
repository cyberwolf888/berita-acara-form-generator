"use client"

import { SEARCH_PLACEHOLDER } from "./constants"

import { Input } from "@/components/ui/input"

type ReportsTableToolbarProps = {
  query: string
  resultCount: number
  onQueryChange: (value: string) => void
}

export function ReportsTableToolbar({
  query,
  resultCount,
  onQueryChange,
}: ReportsTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          className="sm:w-72"
        />
        <span className="text-muted-foreground text-sm">{resultCount} laporan</span>
      </div>
    </div>
  )
}
