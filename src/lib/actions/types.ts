export type DocxTemplateImage = {
  data: string;
  extension: ".png" | ".jpg" | ".jpeg" | ".gif";
  width: number;
  height: number;
};

export type PengukuranDihadiriPrintItem = {
  no: string;
  nama: string;
  foto: DocxTemplateImage;
};

export type BatasBidangTanahPrintItem = {
  no: string;
  jenis: string;
  keterangan: string;
  foto: DocxTemplateImage;
};

export type DaftarPetugasPrintItem = {
  no: string;
  nama: string;
  tipe_posisi: string;
  posisi: string;
  ttd: DocxTemplateImage;
};

// ---------------------------------------------------------------------------
// Detail page types (signed-URL based, no base64 images)
// ---------------------------------------------------------------------------

export type PengukuranDihadiriDetailItem = {
  nama: string;
  foto: string;
};

export type BatasBidangTanahDetailItem = {
  jenis: string;
  keterangan: string;
  foto: string;
};

export type PenggunaanTanahDetailItem = {
  no_hak: string;
  penggunaan: string;
};

export type TanahTerdampakDetailItem = {
  nib: string;
  luas_sebelum: string;
  luas_sesudah: string;
  keterangan: string;
};

export type DaftarPetugasDetailItem = {
  nama: string;
  tipe_posisi: string;
  posisi: string;
  ttd: string;
};

export type BeritaAcaraDetail = {
  ba_date: string;
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
  dasar_tanggal: string;
  dasar_full_name: string;
  dasar_peta_pendaftaran: string;
  dasar_gambar_ukur: string;
  dasar_surat_ukur: string;
  tempat_dibuat: string;
  tanggal_dibuat: string;
  gambar_denah_area: string;
  pengukuran_dihadiri: PengukuranDihadiriDetailItem[];
  batas_bidang_tanah: BatasBidangTanahDetailItem[];
  penggunaan_tanah: PenggunaanTanahDetailItem[];
  tanah_terdampak: TanahTerdampakDetailItem[];
  daftar_petugas: DaftarPetugasDetailItem[];
};

export type BeritaAcaraPrintData = {
  day: string;
  date: string;
  month: string;
  year: number;
  today: string;
  day_number: string;
  month_number: string;
  year_string: string;

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
  dasar_tanggal: string;
  dasar_full_name: string;
  dasar_peta_pendaftaran: string;
  dasar_gambar_ukur: string;
  dasar_surat_ukur: string;

  pengukuran_dihadiri: PengukuranDihadiriPrintItem[];
  batas_bidang_tanah: BatasBidangTanahPrintItem[];
  daftar_petugas: DaftarPetugasPrintItem[];
  gambar_denah_area: DocxTemplateImage;
};
