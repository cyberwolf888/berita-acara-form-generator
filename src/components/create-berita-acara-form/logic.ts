import { type FormData } from "./types";

export function serializeFormValues(value: FormData): Record<string, unknown> {
  return {
    ...value,
    ba_date: value.ba_date?.toISOString() ?? null,
    dasar_tanggal: value.dasar_tanggal?.toISOString() ?? null,
    tanggal_dibuat: value.tanggal_dibuat?.toISOString() ?? null,
    pengukuran_dihadiri: value.pengukuran_dihadiri.map((item) => ({
      nama: item.nama,
      foto: item.foto,
    })),
    batas_bidang_tanah: value.batas_bidang_tanah.map((item) => ({
      jenis: item.jenis,
      foto: item.foto,
      keterangan: item.keterangan,
    })),
    penggunaan_tanah: value.penggunaan_tanah.map((item) => ({
      no_hak: item.no_hak,
      penggunaan: item.penggunaan,
    })),
    tanah_terdampak: value.tanah_terdampak.map((item) => ({
      nib: item.nib,
      luas_sebelum: item.luas_sebelum,
      luas_sesudah: item.luas_sesudah,
      keterangan: item.keterangan,
    })),
    daftar_petugas: value.daftar_petugas.map((item) => ({
      nama: item.nama,
      tipe_posisi: item.tipe_posisi,
      posisi: item.posisi,
      ttd: item.ttd,
    })),
  };
}

export function hasRequiredTopFields(value: FormData) {
  return Boolean(value.ba_date) && value.full_name.trim().length > 0;
}
