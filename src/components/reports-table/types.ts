export type ReportRow = {
  id: string
  ba_date?: string | null
  full_name?: string | null
  no_license?: string | null
  desa?: string | null
}

export type SortKey = "ba_date" | "full_name" | "no_license" | "desa"

export type SortDirection = "asc" | "desc"

export type ReportActionHandler =
  | ((row: ReportRow) => void)
  | ((row: ReportRow) => Promise<void>)

export type ReportColumn = {
  key: SortKey
  label: string
  className?: string
  hiddenBelow?: "sm" | "md"
}
