"use client"

import { columns, EMPTY_STATE_TEXT } from "./constants"
import { formatDate } from "./logic"
import { ReportRowActions } from "./report-row-actions"
import { ReportsTableToolbar } from "./reports-table-toolbar"
import { type ReportActionHandler, type ReportRow, type SortDirection, type SortKey } from "./types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

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
                  className={column.className}
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
            <TableHead className="w-[60px]">
              <span className="sr-only">Aksi</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground text-center">
                {EMPTY_STATE_TEXT}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const isPrinting = printingRowId === row.id

              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{formatDate(row.ba_date)}</TableCell>
                  <TableCell>{row.full_name ?? "—"}</TableCell>
                  <TableCell>{row.no_license ?? "—"}</TableCell>
                  <TableCell>{row.desa ?? "—"}</TableCell>
                  <TableCell>
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
