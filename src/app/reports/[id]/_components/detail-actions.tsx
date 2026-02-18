"use client"

import * as React from "react"
import { Loader2, Pencil, Printer, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { triggerBlobDownload } from "@/components/reports-table/logic"

type DetailActionsProps = {
  id: string
  fullName: string
}

export function DetailActions({ id, fullName }: DetailActionsProps) {
  const [isPrinting, setIsPrinting] = React.useState(false)

  const handlePrint = React.useCallback(async () => {
    if (isPrinting) return
    setIsPrinting(true)
    const toastId = toast.loading("Menyiapkan dokumen...")

    try {
      const response = await fetch("/api/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template: "berita-acara.docx", id }),
      })

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null
        throw new Error(errorPayload?.error ?? "Gagal membuat dokumen.")
      }

      const blob = await response.blob()
      triggerBlobDownload(blob, fullName)
      toast.success("Dokumen berhasil dibuat.", { id: toastId })
    } catch (error) {
      toast.error("Gagal mencetak dokumen.", {
        id: toastId,
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan yang tidak diketahui.",
      })
    } finally {
      setIsPrinting(false)
    }
  }, [id, fullName, isPrinting])

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handlePrint} disabled={isPrinting} className="flex-1 sm:flex-none">
        {isPrinting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Printer />
        )}
        {isPrinting ? "Mencetak..." : "Print"}
      </Button>
      <Button variant="outline" disabled className="flex-1 sm:flex-none">
        <Pencil />
        Edit
      </Button>
      <Button
        variant="outline"
        disabled
        className="flex-1 sm:flex-none text-destructive hover:text-destructive"
      >
        <Trash2 />
        Hapus
      </Button>
    </div>
  )
}
