export type ImageUploadValue =
  | ""
  | {
      kind: "new-upload";
      dataUrl: string;
      fileName: string;
      mimeType: string;
      size: number;
    };

export interface PengukuranDihadiri {
  nama: string;
  foto: ImageUploadValue;
}

export interface BatasBidangTanah {
  jenis: string;
  foto: ImageUploadValue;
  keterangan: string;
}

export interface PenggunaanTanah {
  no_hak: string;
  penggunaan: string;
}

export interface TanahTerdampak {
  nib: string;
  luas_sebelum: string;
  luas_sesudah: string;
  keterangan: string;
}

export interface DaftarPetugas {
  nama: string;
  tipe_posisi: string;
  posisi: string;
  ttd: ImageUploadValue;
}

export interface FormData {
  ba_date: Date | undefined;
  full_name: string;
  no_license: string;
  position: string;
  full_name2: string;
  nip: string;
  position2: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  no_berkas: string;
  dasar_no_pengukuran: string;
  dasar_tanggal: Date | undefined;
  dasar_full_name: string;
  dasar_peta_pendaftaran: string;
  dasar_gambar_ukur: string;
  dasar_surat_ukur: string;
  tempat_dibuat: string;
  tanggal_dibuat: Date | undefined;
  gambar_denah_area: ImageUploadValue;
  pengukuran_dihadiri: PengukuranDihadiri[];
  batas_bidang_tanah: BatasBidangTanah[];
  penggunaan_tanah: PenggunaanTanah[];
  tanah_terdampak: TanahTerdampak[];
  daftar_petugas: DaftarPetugas[];
}
