import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getBeritaAcaraDetail } from "@/lib/actions"

import { DetailActions } from "./_components/detail-actions"

export const dynamic = "force-dynamic"

// ---------------------------------------------------------------------------
// Shared display helpers
// ---------------------------------------------------------------------------

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</dl>
  )
}

function SectionCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Thumbnail({ src, alt }: { src: string; alt: string }) {
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="mt-1 h-20 w-20 rounded-md border object-contain bg-muted"
    />
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BeritaAcaraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getBeritaAcaraDetail(id)

  if (!result.success) {
    notFound()
  }

  const d = result.data

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto w-full max-w-2xl px-4 py-6 flex flex-col gap-5">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Berita Acara
          </h1>
          {d.ba_date && (
            <p className="text-muted-foreground text-sm">{d.ba_date}</p>
          )}
          {d.no_berkas && (
            <p className="text-xs text-muted-foreground">
              No. Berkas:{" "}
              <span className="font-medium text-foreground">{d.no_berkas}</span>
            </p>
          )}
        </div>

        {/* Actions */}
        <DetailActions id={id} fullName={d.full_name} />

        <Separator />

        {/* Informasi Umum */}
        <SectionCard title="Informasi Umum">
          <FieldGrid>
            <Field label="No. Berkas" value={d.no_berkas} />
            <Field label="Desa" value={d.desa} />
            <Field label="Kecamatan" value={d.kecamatan} />
            <Field label="Kabupaten" value={d.kabupaten} />
            <Field label="Provinsi" value={d.provinsi} />
          </FieldGrid>
        </SectionCard>

        {/* Petugas */}
        <SectionCard title="Petugas Ukur">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Petugas 1
              </p>
              <FieldGrid>
                <Field label="Nama" value={d.full_name} />
                <Field label="No. Lisensi" value={d.no_license} />
                <Field label="Jabatan" value={d.position} />
              </FieldGrid>
            </div>
            {(d.full_name2 || d.nip || d.position2) && (
              <>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                    Petugas 2
                  </p>
                  <FieldGrid>
                    <Field label="Nama" value={d.full_name2} />
                    <Field label="NIP" value={d.nip} />
                    <Field label="Jabatan" value={d.position2} />
                  </FieldGrid>
                </div>
              </>
            )}
          </div>
        </SectionCard>

        {/* Dasar Pengukuran */}
        <SectionCard title="Dasar Pengukuran">
          <FieldGrid>
            <Field label="No. Pengukuran" value={d.dasar_no_pengukuran} />
            <Field label="Tanggal" value={d.dasar_tanggal} />
            <Field label="Nama Petugas" value={d.dasar_full_name} />
            <Field label="Peta Pendaftaran" value={d.dasar_peta_pendaftaran} />
            <Field label="Gambar Ukur" value={d.dasar_gambar_ukur} />
            <Field label="Surat Ukur" value={d.dasar_surat_ukur} />
          </FieldGrid>
        </SectionCard>

        {/* Gambar Denah Area */}
        {d.gambar_denah_area && (
          <SectionCard title="Gambar Denah Area">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={d.gambar_denah_area}
              alt="Gambar denah area"
              className="rounded-md border object-contain w-full max-h-80 bg-muted"
            />
          </SectionCard>
        )}

        {/* Pengukuran Dihadiri */}
        {d.pengukuran_dihadiri.length > 0 && (
          <SectionCard title="Pengukuran Dihadiri">
            <ul className="flex flex-col gap-4">
              {d.pengukuran_dihadiri.map((item, i) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-muted-foreground">
                      {i + 1}.
                    </span>
                    <span className="text-sm break-words">{item.nama || "—"}</span>
                  </div>
                  <Thumbnail src={item.foto} alt={`Foto ${item.nama}`} />
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Batas Bidang Tanah */}
        {d.batas_bidang_tanah.length > 0 && (
          <SectionCard title="Batas Bidang Tanah">
            <ul className="flex flex-col gap-5">
              {d.batas_bidang_tanah.map((item, i) => (
                <li key={i} className="flex flex-col gap-1.5">
                  <p className="text-xs text-muted-foreground">{i + 1}.</p>
                  <dl className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    <Field label="Jenis" value={item.jenis} />
                    <Field label="Keterangan" value={item.keterangan} />
                  </dl>
                  <Thumbnail
                    src={item.foto}
                    alt={`Foto batas ${item.jenis}`}
                  />
                  {i < d.batas_bidang_tanah.length - 1 && (
                    <Separator className="mt-1" />
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Penggunaan Tanah */}
        {d.penggunaan_tanah.length > 0 && (
          <SectionCard title="Penggunaan Tanah">
            <ul className="flex flex-col divide-y">
              {d.penggunaan_tanah.map((item, i) => (
                <li key={i} className="py-2.5 first:pt-0 last:pb-0">
                  <dl className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    <Field label="No. Hak" value={item.no_hak} />
                    <Field label="Penggunaan" value={item.penggunaan} />
                  </dl>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Tanah Terdampak */}
        {d.tanah_terdampak.length > 0 && (
          <SectionCard title="Tanah Terdampak">
            <ul className="flex flex-col divide-y">
              {d.tanah_terdampak.map((item, i) => (
                <li key={i} className="py-2.5 first:pt-0 last:pb-0">
                  <dl className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                    <Field label="NIB" value={item.nib} />
                    <Field label="Luas Sebelum" value={item.luas_sebelum} />
                    <Field label="Luas Sesudah" value={item.luas_sesudah} />
                    <Field label="Keterangan" value={item.keterangan} />
                  </dl>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Daftar Petugas */}
        {d.daftar_petugas.length > 0 && (
          <SectionCard title="Daftar Petugas">
            <ul className="flex flex-col gap-5">
              {d.daftar_petugas.map((item, i) => (
                <li key={i} className="flex flex-col gap-2">
                  <dl className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    <Field label="Nama" value={item.nama} />
                    <Field label="Tipe Posisi" value={item.tipe_posisi} />
                    <Field label="Posisi" value={item.posisi} />
                  </dl>
                  {item.ttd && (
                    <div className="flex flex-col gap-0.5">
                      <dt className="text-xs text-muted-foreground">
                        Tanda Tangan
                      </dt>
                      <Thumbnail
                        src={item.ttd}
                        alt={`TTD ${item.nama}`}
                      />
                    </div>
                  )}
                  {i < d.daftar_petugas.length - 1 && (
                    <Separator className="mt-1" />
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        {/* Tempat & Tanggal Dibuat */}
        {(d.tempat_dibuat || d.tanggal_dibuat) && (
          <SectionCard title="Tempat &amp; Tanggal Dibuat">
            <FieldGrid>
              <Field label="Tempat Dibuat" value={d.tempat_dibuat} />
              <Field label="Tanggal Dibuat" value={d.tanggal_dibuat} />
            </FieldGrid>
          </SectionCard>
        )}
      </main>
    </div>
  )
}
