import { type ReportColumn } from "./types"

export const columns: ReportColumn[] = [
  { key: "ba_date", label: "Tanggal BA", className: "min-w-[150px]" },
  { key: "full_name", label: "Nama Lengkap", className: "min-w-[220px]" },
  { key: "no_license", label: "No Lisensi", className: "min-w-[160px]" },
  { key: "desa", label: "Desa", className: "min-w-[160px]" },
]

export const DEFAULT_SORT_KEY = "ba_date" as const
export const DEFAULT_SORT_DIRECTION = "desc" as const

export const SEARCH_PLACEHOLDER = "Cari tanggal, nama, lisensi, atau desa"
export const EMPTY_STATE_TEXT = "Belum ada laporan resmi yang dibuat."
