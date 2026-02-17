"use client"

import { useReportActions } from "./use-report-actions"
import { useReportsTable } from "./use-reports-table"
import { ReportsTableView } from "./reports-table-view"
import { type ReportActionHandler, type ReportRow } from "./types"

export type ReportsTableProps = {
  rows: ReportRow[]
  onEdit?: ReportActionHandler
  onDelete?: ReportActionHandler
}

function noopAction() {
  // No-op by design for disabled placeholder actions
}

export default function ReportsTable({ rows, onEdit, onDelete }: ReportsTableProps) {
  const { query, setQuery, sortKey, sortDirection, sortedRows, handleSort } =
    useReportsTable(rows)

  const {
    printingRowId,
    handlePrint,
    handleEdit,
    handleDelete,
    canEdit,
    canDelete,
  } = useReportActions({ onEdit, onDelete })

  return (
    <ReportsTableView
      rows={sortedRows}
      query={query}
      resultCount={sortedRows.length}
      sortKey={sortKey}
      sortDirection={sortDirection}
      printingRowId={printingRowId}
      canEdit={canEdit}
      canDelete={canDelete}
      onQueryChange={setQuery}
      onSort={handleSort}
      onPrint={handlePrint}
      onEdit={canEdit ? handleEdit : noopAction}
      onDelete={canDelete ? handleDelete : noopAction}
    />
  )
}
