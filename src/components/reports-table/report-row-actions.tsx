"use client"

import * as React from "react"
import { EllipsisVertical, Loader2, Pencil, Printer, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { type ReportActionHandler, type ReportRow } from "./types"

type ReportRowActionsProps = {
  row: ReportRow
  isPrinting: boolean
  canEdit: boolean
  canDelete: boolean
  onPrint: ReportActionHandler
  onEdit: ReportActionHandler
  onDelete: ReportActionHandler
}

export function ReportRowActions({
  row,
  isPrinting,
  canEdit,
  canDelete,
  onPrint,
  onEdit,
  onDelete,
}: ReportRowActionsProps) {
  const actionLabel = row.full_name?.trim() || "laporan"

  const handlePrint = React.useCallback(() => {
    void onPrint(row)
  }, [onPrint, row])

  const handleEdit = React.useCallback(() => {
    if (!canEdit) return
    void onEdit(row)
  }, [canEdit, onEdit, row])

  const handleDelete = React.useCallback(() => {
    if (!canDelete) return
    void onDelete(row)
  }, [canDelete, onDelete, row])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
          disabled={isPrinting}
        >
          <EllipsisVertical />
          <span className="sr-only">Aksi untuk {actionLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem disabled={isPrinting} onClick={handlePrint}>
          {isPrinting ? <Loader2 className="animate-spin" /> : <Printer />}
          {isPrinting ? "Mencetak..." : "Print"}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!canEdit || isPrinting} onClick={handleEdit}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!canDelete || isPrinting}
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
