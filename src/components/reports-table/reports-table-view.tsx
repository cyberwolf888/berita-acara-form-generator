"use client"

import { columns, EMPTY_STATE_TEXT } from "./constants"
import { formatDate } from "./logic"
import { ReportRowActions } from "./report-row-actions"
import { ReportsTableToolbar } from "./reports-table-toolbar"
import { type ReportActionHandler, type ReportColumn, type ReportRow, type SortDirection, type SortKey } from "./types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

function getColumnClassName(col: ReportColumn): string | undefined {
  if (col.hiddenBelow === "md") return cn(col.className, "hidden md:table-cell")
  if (col.hiddenBelow === "sm") return cn(col.className, "hidden sm:table-cell")
  return col.className
}

type ReportsTableViewProps = {
  rows: ReportRow[]
  query: string
  resultCount: number
  sortKey: SortKey
  sortDirection: SortDirection
  printingRowId: string | null
  canEdit: boolean
  canDelete: boolean
  onQueryChange: (value: string) => void
  onSort: (key: SortKey) => void
  onPrint: ReportActionHandler
  onEdit: ReportActionHandler
  onDelete: ReportActionHandler
  onRowClick?: (row: ReportRow) => void
}

export function ReportsTableView({
  rows,
  query,
  resultCount,
  sortKey,
  sortDirection,
  printingRowId,
  canEdit,
  canDelete,
  onQueryChange,
  onSort,
  onPrint,
  onEdit,
  onDelete,
  onRowClick,
}: ReportsTableViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <ReportsTableToolbar
        query={query}
        resultCount={resultCount}
        onQueryChange={onQueryChange}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="md:hidden w-10">
              <span className="sr-only">Aksi</span>
            </TableHead>
            {columns.map((column) => {
              const isActive = sortKey === column.key
              const sortLabel =
                isActive && sortDirection === "asc" ? "↑" : isActive ? "↓" : ""
              const ariaSort = isActive
                ? sortDirection === "asc"
                  ? "ascending"
                  : "descending"
                : "none"

              return (
                <TableHead
                  key={column.key}
                  className={getColumnClassName(column)}
                  aria-sort={ariaSort}
                >
                  <button
                    type="button"
                    onClick={() => onSort(column.key)}
                    className={cn(
                      "text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium",
                      isActive && "text-foreground"
                    )}
                  >
                    <span>{column.label}</span>
                    <span className="text-xs" aria-hidden="true">
                      {sortLabel}
                    </span>
                    <span className="sr-only">
                      {isActive
                        ? `Urutkan ${column.label} ${sortDirection === "asc" ? "menurun" : "menaik"}`
                        : `Urutkan berdasarkan ${column.label}`}
                    </span>
                  </button>
                </TableHead>
              )
            })}
            <TableHead className="hidden md:table-cell w-[60px]">
              <span className="sr-only">Aksi</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="text-muted-foreground text-center">
                {EMPTY_STATE_TEXT}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const isPrinting = printingRowId === row.id

              return (
                <TableRow
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  <TableCell className="md:hidden p-2" onClick={(e) => e.stopPropagation()}>
                    <ReportRowActions
                      row={row}
                      isPrinting={isPrinting}
                      canEdit={canEdit}
                      canDelete={canDelete}
                      align="start"
                      onPrint={onPrint}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{formatDate(row.ba_date)}</TableCell>
                  <TableCell>{row.full_name ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">{row.no_license ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell">{row.desa ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                    <ReportRowActions
                      row={row}
                      isPrinting={isPrinting}
                      canEdit={canEdit}
                      canDelete={canDelete}
                      onPrint={onPrint}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
