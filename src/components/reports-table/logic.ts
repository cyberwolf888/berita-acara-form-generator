import { type ReportRow, type SortDirection, type SortKey } from "./types"

const displayDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const numericDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
})

const monthNameFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
})

function parseIsoDate(isoDate?: string | null) {
  if (!isoDate) return null

  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(isoDate?: string | null) {
  const date = parseIsoDate(isoDate)
  if (!date) return "—"
  return displayDateFormatter.format(date)
}

export function buildDocxDatePayload(isoDate?: string | null) {
  const date = parseIsoDate(isoDate) ?? new Date()
  const dateNumber = String(date.getDate()).padStart(2, "0")
  const monthNumber = String(date.getMonth() + 1).padStart(2, "0")
  const yearNumber = date.getFullYear()

  return {
    day: weekdayFormatter.format(date),
    date: dateNumber,
    month: monthNameFormatter.format(date),
    year: yearNumber,

    // Backward-compatible keys for existing template placeholders.
    today: numericDateFormatter.format(date),
    day_number: dateNumber,
    month_number: monthNumber,
    year_string: String(yearNumber),
  }
}

export function getSortValue(row: ReportRow, key: SortKey) {
  if (key === "ba_date") {
    const date = parseIsoDate(row.ba_date)
    return date ? date.getTime() : 0
  }

  const value = row[key]
  return typeof value === "string" ? value.toLowerCase() : ""
}

export function filterRows(rows: ReportRow[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return rows

  return rows.filter((row) => {
    const values = [
      formatDate(row.ba_date),
      row.full_name,
      row.no_license,
      row.desa,
      row.ba_date,
    ]

    return values.some((value) =>
      String(value ?? "").toLowerCase().includes(normalizedQuery)
    )
  })
}

export function sortRows(
  rows: ReportRow[],
  sortKey: SortKey,
  sortDirection: SortDirection
) {
  return [...rows].sort((a, b) => {
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
}

export function buildFileName(fullName?: string | null) {
  const baseName =
    fullName?.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-") ||
    "berita-acara"

  return `${baseName.replace(/^-+|-+$/g, "") || "berita-acara"}.docx`
}

export function triggerBlobDownload(blob: Blob, preferredFileName?: string | null) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = buildFileName(preferredFileName)
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
