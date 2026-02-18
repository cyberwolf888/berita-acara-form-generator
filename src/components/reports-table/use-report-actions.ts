"use client"

import * as React from "react"
import { toast } from "sonner"

import { triggerBlobDownload } from "./logic"
import { type ReportActionHandler, type ReportRow } from "./types"

type UseReportActionsOptions = {
  onEdit?: ReportActionHandler
  onDelete?: ReportActionHandler
}

export function useReportActions({ onEdit, onDelete }: UseReportActionsOptions) {
  const [printingRowId, setPrintingRowId] = React.useState<string | null>(null)

  const handlePrint = React.useCallback(
    async (row: ReportRow) => {
      if (!row.id || printingRowId) {
        return
      }

      setPrintingRowId(row.id)
      const toastId = toast.loading("Menyiapkan dokumen...")

      try {
        const response = await fetch("/api/docx", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            template: "berita-acara.docx",
            id: row.id,
          }),
        })

        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as
            | { error?: string }
            | null

          throw new Error(errorPayload?.error || "Gagal membuat dokumen.")
        }

        const blob = await response.blob()
        triggerBlobDownload(blob, row.full_name)

        toast.success("Dokumen berhasil dibuat.", {
          id: toastId,
        })
      } catch (error) {
        toast.error("Gagal mencetak dokumen.", {
          id: toastId,
          description:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan yang tidak diketahui.",
        })
      } finally {
        setPrintingRowId(null)
      }
    },
    [printingRowId]
  )

  const handleEdit = React.useCallback(
    (row: ReportRow) => {
      if (!onEdit) return
      void onEdit(row)
    },
    [onEdit]
  )

  const handleDelete = React.useCallback(
    (row: ReportRow) => {
      if (!onDelete) return
      void onDelete(row)
    },
    [onDelete]
  )

  return {
    printingRowId,
    handlePrint,
    handleEdit,
    handleDelete,
    canEdit: Boolean(onEdit),
    canDelete: Boolean(onDelete),
  }
}
