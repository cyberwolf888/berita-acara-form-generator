"use client"

import * as React from "react"
import { EllipsisVertical, Printer, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type ReportRow = {
  id: string
  ba_date?: string | null
  full_name?: string | null
  no_license?: string | null
  desa?: string | null
}

type SortKey = "ba_date" | "full_name" | "no_license" | "desa"
type SortDirection = "asc" | "desc"

type ReportsTableProps = {
  rows: ReportRow[]
}

const columns: Array<{ key: SortKey; label: string; className?: string }> = [
  { key: "ba_date", label: "Tanggal BA", className: "min-w-[150px]" },
  { key: "full_name", label: "Nama Lengkap", className: "min-w-[220px]" },
  { key: "no_license", label: "No Lisensi", className: "min-w-[160px]" },
  { key: "desa", label: "Desa", className: "min-w-[160px]" },
]

function formatDate(isoDate?: string | null) {
  if (!isoDate) return "—"
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function getSortValue(row: ReportRow, key: SortKey) {
  if (key === "ba_date") {
    if (!row.ba_date) return 0
    const timestamp = new Date(row.ba_date).getTime()
    return Number.isNaN(timestamp) ? 0 : timestamp
  }

  const value = row[key]
  return typeof value === "string" ? value.toLowerCase() : ""
}

export default function ReportsTable({ rows }: ReportsTableProps) {
  const [query, setQuery] = React.useState("")
  const [sortKey, setSortKey] = React.useState<SortKey>("ba_date")
  const [sortDirection, setSortDirection] =
    React.useState<SortDirection>("desc")


  const filteredRows = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return rows

    return rows.filter((row) => {
      const values = [
        formatDate(row.ba_date),
        row.full_name,
        row.no_license,
        row.desa,
      ]
      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(normalizedQuery)
      )
    })
  }, [query, rows])

  const sortedRows = React.useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = getSortValue(a, sortKey)
      const bValue = getSortValue(b, sortKey)

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      const comparison = String(aValue).localeCompare(String(bValue), "id", {
        numeric: true,
        sensitivity: "base",
      })
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [filteredRows, sortDirection, sortKey])

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
      return
    }

    setSortKey(key)
    setSortDirection(key === "ba_date" ? "desc" : "asc")
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari tanggal, nama, lisensi, atau desa"
            className="sm:w-72"
          />
          <span className="text-muted-foreground text-sm">
            {sortedRows.length} laporan
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const isActive = sortKey === column.key
              const sortLabel =
                isActive && sortDirection === "asc" ? "↑" : isActive ? "↓" : ""

              return (
                <TableHead key={column.key} className={column.className}>
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className={cn(
                      "text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium",
                      isActive && "text-foreground"
                    )}
                  >
                    <span>{column.label}</span>
                    <span className="text-xs">{sortLabel}</span>
                  </button>
                </TableHead>
              )
            })}
            <TableHead className="w-[60px]"><span className="sr-only">Aksi</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-muted-foreground text-center">
                Belum ada laporan resmi yang dibuat.
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  {formatDate(row.ba_date)}
                </TableCell>
                <TableCell>{row.full_name ?? "—"}</TableCell>
                <TableCell>{row.no_license ?? "—"}</TableCell>
                <TableCell>{row.desa ?? "—"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
                      >
                        <EllipsisVertical />
                        <span className="sr-only">Aksi</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem disabled>
                        <Printer />
                        Print
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled>
                        <Pencil />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled className="text-destructive focus:text-destructive">
                        <Trash2 />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
