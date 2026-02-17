"use server";

import { db } from "@/lib/firebase-admin";

import type { BeritaAcaraPrintData } from "./types";
import {
  asText,
  buildDocxDatePayload,
  formatLongDate,
  normalizeBatasBidangTanah,
  normalizeDaftarPetugas,
  normalizeDocxImage,
  normalizePengukuranDihadiri,
} from "./helpers";

export async function getBeritaAcaraPrintData(
  id: string
): Promise<
  | { success: true; data: BeritaAcaraPrintData }
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
    const baDatePayload = buildDocxDatePayload(data.ba_date);

    const desa = asText(data.desa);
    const kecamatan = asText(data.kecamatan);
    const kabupaten = asText(data.kabupaten);
    const provinsi = asText(data.provinsi);
    const noBerkas = asText(data.no_berkas);

    const [pengukuranDihadiri, batasBidangTanah, daftarPetugas, gambarDenahArea] =
      await Promise.all([
        normalizePengukuranDihadiri(data.pengukuran_dihadiri),
        normalizeBatasBidangTanah(data.batas_bidang_tanah),
        normalizeDaftarPetugas(data.daftar_petugas),
        normalizeDocxImage(data.gambar_denah_area),
      ]);

    return {
      success: true,
      data: {
        ...baDatePayload,

        full_name: asText(data.full_name),
        no_license: asText(data.no_license),
        position: asText(data.position),
        full_name2: asText(data.full_name2),
        nip: asText(data.nip),
        position2: asText(data.position2),

        desa,
        kecamatan,
        kabupaten,
        provinsi,
        no_berkas: noBerkas,

        dasar_no_pengukuran: asText(data.dasar_no_pengukuran),
        dasar_tanggal: formatLongDate(data.dasar_tanggal),
        dasar_full_name: asText(data.dasar_full_name),
        dasar_peta_pendaftaran: asText(data.dasar_peta_pendaftaran),
        dasar_gambar_ukur: asText(data.dasar_gambar_ukur),
        dasar_surat_ukur: asText(data.dasar_surat_ukur),

        pengukuran_dihadiri: pengukuranDihadiri,
        batas_bidang_tanah: batasBidangTanah,
        daftar_petugas: daftarPetugas,
        gambar_denah_area: gambarDenahArea,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
