"use server";

import { bucket, db } from "@/lib/firebase-admin";

import { asDate, asText, formatLongDate } from "./helpers";
import type {
  BatasBidangTanahDetailItem,
  BeritaAcaraDetail,
  DaftarPetugasDetailItem,
  PenggunaanTanahDetailItem,
  PengukuranDihadiriDetailItem,
  TanahTerdampakDetailItem,
} from "./types";

function getStoragePath(value: unknown): string {
  const raw = asText(value).trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return "";
  if (raw.startsWith("gs://")) {
    const withoutScheme = raw.slice(5);
    const slashIndex = withoutScheme.indexOf("/");
    if (slashIndex === -1) return "";
    return withoutScheme.slice(slashIndex + 1).replace(/^\/+/, "");
  }
  return raw.replace(/^\/+/, "");
}

async function getSignedUrl(value: unknown): Promise<string> {
  const path = getStoragePath(value);
  if (!path) return "";
  try {
    const [url] = await bucket.file(path).getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    });
    return url;
  } catch {
    return "";
  }
}

function formatDisplayDate(value: unknown): string {
  const date = asDate(value);
  return date ? formatLongDate(date) : "";
}

export async function getBeritaAcaraDetail(
  id: string
): Promise<
  | { success: true; data: BeritaAcaraDetail }
  | { success: false; error: string }
> {
  try {
    if (!id.trim()) {
      return { success: false, error: "ID dokumen tidak valid." };
    }

    const doc = await db.collection("berita-acara").doc(id).get();

    if (!doc.exists) {
      return { success: false, error: "Dokumen tidak ditemukan." };
    }

    const data = doc.data() ?? {};

    const pengukuranDihadiriRaw: unknown[] = Array.isArray(
      data.pengukuran_dihadiri
    )
      ? data.pengukuran_dihadiri
      : [];
    const batasBidangTanahRaw: unknown[] = Array.isArray(data.batas_bidang_tanah)
      ? data.batas_bidang_tanah
      : [];
    const daftarPetugasRaw: unknown[] = Array.isArray(data.daftar_petugas)
      ? data.daftar_petugas
      : [];
    const penggunaanTanahRaw: unknown[] = Array.isArray(data.penggunaan_tanah)
      ? data.penggunaan_tanah
      : [];
    const tanahTerdampakRaw: unknown[] = Array.isArray(data.tanah_terdampak)
      ? data.tanah_terdampak
      : [];

    const [gambarDenahAreaUrl, pengukuranDihadiri, batasBidangTanah, daftarPetugas] =
      await Promise.all([
        getSignedUrl(data.gambar_denah_area),
        Promise.all(
          pengukuranDihadiriRaw.map(
            async (item): Promise<PengukuranDihadiriDetailItem> => {
              const r = (item ?? {}) as Record<string, unknown>;
              return { nama: asText(r.nama), foto: await getSignedUrl(r.foto) };
            }
          )
        ),
        Promise.all(
          batasBidangTanahRaw.map(
            async (item): Promise<BatasBidangTanahDetailItem> => {
              const r = (item ?? {}) as Record<string, unknown>;
              return {
                jenis: asText(r.jenis),
                keterangan: asText(r.keterangan),
                foto: await getSignedUrl(r.foto),
              };
            }
          )
        ),
        Promise.all(
          daftarPetugasRaw.map(
            async (item): Promise<DaftarPetugasDetailItem> => {
              const r = (item ?? {}) as Record<string, unknown>;
              return {
                nama: asText(r.nama),
                tipe_posisi: asText(r.tipe_posisi),
                posisi: asText(r.posisi),
                ttd: await getSignedUrl(r.ttd),
              };
            }
          )
        ),
      ]);

    const penggunaanTanah: PenggunaanTanahDetailItem[] = penggunaanTanahRaw.map(
      (item) => {
        const r = (item ?? {}) as Record<string, unknown>;
        return { no_hak: asText(r.no_hak), penggunaan: asText(r.penggunaan) };
      }
    );

    const tanahTerdampak: TanahTerdampakDetailItem[] = tanahTerdampakRaw.map(
      (item) => {
        const r = (item ?? {}) as Record<string, unknown>;
        return {
          nib: asText(r.nib),
          luas_sebelum: asText(r.luas_sebelum),
          luas_sesudah: asText(r.luas_sesudah),
          keterangan: asText(r.keterangan),
        };
      }
    );

    return {
      success: true,
      data: {
        ba_date: formatDisplayDate(data.ba_date),
        full_name: asText(data.full_name),
        no_license: asText(data.no_license),
        position: asText(data.position),
        full_name2: asText(data.full_name2),
        nip: asText(data.nip),
        position2: asText(data.position2),
        desa: asText(data.desa),
        kecamatan: asText(data.kecamatan),
        kabupaten: asText(data.kabupaten),
        provinsi: asText(data.provinsi),
        no_berkas: asText(data.no_berkas),
        dasar_no_pengukuran: asText(data.dasar_no_pengukuran),
        dasar_tanggal: formatLongDate(data.dasar_tanggal),
        dasar_full_name: asText(data.dasar_full_name),
        dasar_peta_pendaftaran: asText(data.dasar_peta_pendaftaran),
        dasar_gambar_ukur: asText(data.dasar_gambar_ukur),
        dasar_surat_ukur: asText(data.dasar_surat_ukur),
        tempat_dibuat: asText(data.tempat_dibuat),
        tanggal_dibuat: formatDisplayDate(data.tanggal_dibuat),
        gambar_denah_area: gambarDenahAreaUrl,
        pengukuran_dihadiri: pengukuranDihadiri,
        batas_bidang_tanah: batasBidangTanah,
        penggunaan_tanah: penggunaanTanah,
        tanah_terdampak: tanahTerdampak,
        daftar_petugas: daftarPetugas,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
