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
