import Link from "next/link"

export const dynamic = "force-dynamic"

import ReportsTable, { type ReportRow } from "@/components/reports-table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDocuments } from "@/lib/actions"

function toIsoDate(value: unknown) {
  if (!value) return null

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === "string") {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
  }

  if (typeof value === "object") {
    const record = value as { toDate?: () => Date; seconds?: number }
    if (typeof record.toDate === "function") {
      return record.toDate().toISOString()
    }
    if (typeof record.seconds === "number") {
      return new Date(record.seconds * 1000).toISOString()
    }
  }

  return null
}

function asText(value: unknown) {
  if (typeof value === "string") return value
  if (value === null || value === undefined) return null
  return String(value)
}

export default async function Home() {
  const documents = await getDocuments("berita-acara")
  const rows: ReportRow[] = documents.map((doc) => {
    const record = doc as Record<string, unknown>
    const id = typeof record.id === "string" ? record.id : String(record.id ?? "")

    return {
      id,
      ba_date: toIsoDate(record.ba_date),
      full_name: asText(record.full_name),
      no_license: asText(record.no_license),
      desa: asText(record.desa),
    }
  })

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              Berita Acara Generator
            </h1>
            <p className="text-muted-foreground text-sm">
              Daftar laporan resmi yang sudah dibuat.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/create-berita-acara">Buat Berita Acara</Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Berita Acara Resmi</CardTitle>
            <CardDescription>
              Tampilkan data berdasarkan tanggal, nama, lisensi, dan desa.
            </CardDescription>
            <CardAction />
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <ReportsTable rows={rows} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
