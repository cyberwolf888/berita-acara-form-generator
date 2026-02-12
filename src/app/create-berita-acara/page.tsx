"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { ArrowLeftIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { saveBeritaAcara } from "@/lib/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/date-picker";
import { FileUpload } from "@/components/file-upload";

interface PengukuranDihadiri {
  nama: string;
  foto: string;
}

interface BatasBidangTanah {
  jenis: string;
  foto: string;
  keterangan: string;
}

interface PenggunaanTanah {
  no_hak: string;
  penggunaan: string;
}

interface TanahTerdampak {
  nib: string;
  luas_sebelum: string;
  luas_sesudah: string;
  keterangan: string;
}

interface DaftarPetugas {
  nama: string;
  tipe_posisi: string;
  posisi: string;
  ttd: string;
}

interface FormData {
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
  pengukuran_dihadiri: PengukuranDihadiri[];
  batas_bidang_tanah: BatasBidangTanah[];
  penggunaan_tanah: PenggunaanTanah[];
  tanah_terdampak: TanahTerdampak[];
  daftar_petugas: DaftarPetugas[];
}

const defaultValues: FormData = {
  ba_date: undefined,
  full_name: "",
  no_license: "",
  position: "",
  full_name2: "",
  nip: "",
  position2: "",
  desa: "",
  kecamatan: "",
  kabupaten: "",
  provinsi: "",
  no_berkas: "",
  dasar_no_pengukuran: "",
  dasar_tanggal: undefined,
  dasar_full_name: "",
  dasar_peta_pendaftaran: "",
  dasar_gambar_ukur: "",
  dasar_surat_ukur: "",
  tempat_dibuat: "",
  tanggal_dibuat: undefined,
  pengukuran_dihadiri: [{ nama: "", foto: "" }],
  batas_bidang_tanah: [{ jenis: "", foto: "", keterangan: "" }],
  penggunaan_tanah: [{ no_hak: "", penggunaan: "" }],
  tanah_terdampak: [{ nib: "", luas_sebelum: "", luas_sesudah: "", keterangan: "" }],
  daftar_petugas: [{ nama: "", tipe_posisi: "", posisi: "", ttd: "" }],
};

function FieldWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default function CreateBeritaAcaraPage() {
  const router = useRouter();
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const serialized: Record<string, unknown> = {
        ...value,
        ba_date: value.ba_date?.toISOString() ?? null,
        dasar_tanggal: value.dasar_tanggal?.toISOString() ?? null,
        tanggal_dibuat: value.tanggal_dibuat?.toISOString() ?? null,
        // Explicitly map arrays to plain objects to avoid
        // Firestore "invalid nested entity" errors from proxy objects
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

      const result = await saveBeritaAcara(serialized);

      if (result.success) {
        toast.success("Berita acara berhasil disimpan!");
        form.reset();
      } else {
        toast.error("Gagal menyimpan berita acara.", {
          description: result.error,
        });
      }
    },
  });

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
              >
              <ArrowLeftIcon className="mr-1 h-4 w-4" />
              Kembali
            </Button>
            <CardTitle className="text-2xl">Buat Berita Acara</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* ===== Info Umum ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Info Umum</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="ba_date">
                  {(field) => (
                    <FieldWrapper label="Tanggal BA">
                      <DatePicker
                        value={field.state.value}
                        onChange={(date) => field.handleChange(date)}
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="full_name">
                  {(field) => (
                    <FieldWrapper label="Nama Lengkap">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Nama lengkap"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="no_license">
                  {(field) => (
                    <FieldWrapper label="No. Lisensi">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="No. lisensi"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="position">
                  {(field) => (
                    <FieldWrapper label="Jabatan">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Jabatan"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="full_name2">
                  {(field) => (
                    <FieldWrapper label="Nama Lengkap 2">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Nama lengkap 2"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="nip">
                  {(field) => (
                    <FieldWrapper label="NIP">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="NIP"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="position2">
                  {(field) => (
                    <FieldWrapper label="Jabatan 2">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Jabatan 2"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>
              </div>
            </section>

            <Separator />

            {/* ===== Lokasi ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Lokasi</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="desa">
                  {(field) => (
                    <FieldWrapper label="Desa">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Desa"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="kecamatan">
                  {(field) => (
                    <FieldWrapper label="Kecamatan">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Kecamatan"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="kabupaten">
                  {(field) => (
                    <FieldWrapper label="Kabupaten">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Kabupaten"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="provinsi">
                  {(field) => (
                    <FieldWrapper label="Provinsi">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Provinsi"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>
              </div>
            </section>

            <Separator />

            {/* ===== Dasar Pengukuran ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Dasar Pengukuran</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="no_berkas">
                  {(field) => (
                    <FieldWrapper label="No. Berkas">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="No. berkas"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="dasar_no_pengukuran">
                  {(field) => (
                    <FieldWrapper label="No. Pengukuran">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="No. pengukuran"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="dasar_tanggal">
                  {(field) => (
                    <FieldWrapper label="Tanggal Dasar">
                      <DatePicker
                        value={field.state.value}
                        onChange={(date) => field.handleChange(date)}
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="dasar_full_name">
                  {(field) => (
                    <FieldWrapper label="Nama Lengkap (Dasar)">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Nama lengkap"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="dasar_peta_pendaftaran">
                  {(field) => (
                    <FieldWrapper label="Peta Pendaftaran">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Peta pendaftaran"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="dasar_gambar_ukur">
                  {(field) => (
                    <FieldWrapper label="Gambar Ukur">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Gambar ukur"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="dasar_surat_ukur">
                  {(field) => (
                    <FieldWrapper label="Surat Ukur">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Surat ukur"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>
              </div>
            </section>

            <Separator />

            {/* ===== Tempat & Tanggal Dibuat ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Tempat & Tanggal Dibuat</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field name="tempat_dibuat">
                  {(field) => (
                    <FieldWrapper label="Tempat Dibuat">
                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="Tempat dibuat"
                      />
                    </FieldWrapper>
                  )}
                </form.Field>

                <form.Field name="tanggal_dibuat">
                  {(field) => (
                    <FieldWrapper label="Tanggal Dibuat">
                      <DatePicker
                        value={field.state.value}
                        onChange={(date) => field.handleChange(date)}
                      />
                    </FieldWrapper>
                  )}
                </form.Field>
              </div>
            </section>

            <Separator />

            {/* ===== Dynamic: Pengukuran Dihadiri ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Pengukuran Dihadiri</h2>
              <form.Field name="pengukuran_dihadiri" mode="array">
                {(field) => (
                  <div className="space-y-4">
                    {field.state.value.map((_, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg border p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{i + 1}
                          </span>
                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => field.removeValue(i)}
                            >
                              <Trash2Icon className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`pengukuran_dihadiri[${i}].nama`}>
                            {(subField) => (
                              <FieldWrapper label="Nama">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Nama"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field name={`pengukuran_dihadiri[${i}].foto`}>
                            {(subField) => (
                              <FieldWrapper label="Foto">
                                <FileUpload
                                  value={subField.state.value}
                                  onChange={(val) =>
                                    subField.handleChange(val)
                                  }
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        field.pushValue({ nama: "", foto: "" })
                      }
                    >
                      <PlusIcon className="mr-1 size-4" />
                      Tambah Pengukuran Dihadiri
                    </Button>
                  </div>
                )}
              </form.Field>
            </section>

            <Separator />

            {/* ===== Dynamic: Batas Bidang Tanah ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Batas Bidang Tanah</h2>
              <form.Field name="batas_bidang_tanah" mode="array">
                {(field) => (
                  <div className="space-y-4">
                    {field.state.value.map((_, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg border p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{i + 1}
                          </span>
                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => field.removeValue(i)}
                            >
                              <Trash2Icon className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`batas_bidang_tanah[${i}].jenis`}>
                            {(subField) => (
                              <FieldWrapper label="Jenis">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Jenis"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field name={`batas_bidang_tanah[${i}].foto`}>
                            {(subField) => (
                              <FieldWrapper label="Foto">
                                <FileUpload
                                  value={subField.state.value}
                                  onChange={(val) =>
                                    subField.handleChange(val)
                                  }
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field
                            name={`batas_bidang_tanah[${i}].keterangan`}
                          >
                            {(subField) => (
                              <FieldWrapper label="Keterangan">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Keterangan"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        field.pushValue({
                          jenis: "",
                          foto: "",
                          keterangan: "",
                        })
                      }
                    >
                      <PlusIcon className="mr-1 size-4" />
                      Tambah Batas Bidang Tanah
                    </Button>
                  </div>
                )}
              </form.Field>
            </section>

            <Separator />

            {/* ===== Dynamic: Penggunaan Tanah ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Penggunaan Tanah</h2>
              <form.Field name="penggunaan_tanah" mode="array">
                {(field) => (
                  <div className="space-y-4">
                    {field.state.value.map((_, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg border p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{i + 1}
                          </span>
                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => field.removeValue(i)}
                            >
                              <Trash2Icon className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`penggunaan_tanah[${i}].no_hak`}>
                            {(subField) => (
                              <FieldWrapper label="No. Hak">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="No. hak"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field
                            name={`penggunaan_tanah[${i}].penggunaan`}
                          >
                            {(subField) => (
                              <FieldWrapper label="Penggunaan">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Penggunaan"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        field.pushValue({ no_hak: "", penggunaan: "" })
                      }
                    >
                      <PlusIcon className="mr-1 size-4" />
                      Tambah Penggunaan Tanah
                    </Button>
                  </div>
                )}
              </form.Field>
            </section>

            <Separator />

            {/* ===== Dynamic: Tanah Terdampak ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Tanah Terdampak</h2>
              <form.Field name="tanah_terdampak" mode="array">
                {(field) => (
                  <div className="space-y-4">
                    {field.state.value.map((_, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg border p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{i + 1}
                          </span>
                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => field.removeValue(i)}
                            >
                              <Trash2Icon className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`tanah_terdampak[${i}].nib`}>
                            {(subField) => (
                              <FieldWrapper label="NIB">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="NIB"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field
                            name={`tanah_terdampak[${i}].luas_sebelum`}
                          >
                            {(subField) => (
                              <FieldWrapper label="Luas Sebelum">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Luas sebelum"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field
                            name={`tanah_terdampak[${i}].luas_sesudah`}
                          >
                            {(subField) => (
                              <FieldWrapper label="Luas Sesudah">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Luas sesudah"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field
                            name={`tanah_terdampak[${i}].keterangan`}
                          >
                            {(subField) => (
                              <FieldWrapper label="Keterangan">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Keterangan"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        field.pushValue({
                          nib: "",
                          luas_sebelum: "",
                          luas_sesudah: "",
                          keterangan: "",
                        })
                      }
                    >
                      <PlusIcon className="mr-1 size-4" />
                      Tambah Tanah Terdampak
                    </Button>
                  </div>
                )}
              </form.Field>
            </section>

            <Separator />

            {/* ===== Dynamic: Daftar Petugas ===== */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Daftar Petugas</h2>
              <form.Field name="daftar_petugas" mode="array">
                {(field) => (
                  <div className="space-y-4">
                    {field.state.value.map((_, i) => (
                      <div
                        key={i}
                        className="relative rounded-lg border p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{i + 1}
                          </span>
                          {field.state.value.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => field.removeValue(i)}
                            >
                              <Trash2Icon className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <form.Field name={`daftar_petugas[${i}].nama`}>
                            {(subField) => (
                              <FieldWrapper label="Nama">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Nama"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field
                            name={`daftar_petugas[${i}].tipe_posisi`}
                          >
                            {(subField) => (
                              <FieldWrapper label="Tipe Posisi">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Tipe posisi"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field name={`daftar_petugas[${i}].posisi`}>
                            {(subField) => (
                              <FieldWrapper label="Posisi">
                                <Input
                                  value={subField.state.value}
                                  onChange={(e) =>
                                    subField.handleChange(e.target.value)
                                  }
                                  onBlur={subField.handleBlur}
                                  placeholder="Posisi"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>

                          <form.Field name={`daftar_petugas[${i}].ttd`}>
                            {(subField) => (
                              <FieldWrapper label="Tanda Tangan">
                                <FileUpload
                                  value={subField.state.value}
                                  onChange={(val) =>
                                    subField.handleChange(val)
                                  }
                                  label="Upload TTD"
                                />
                              </FieldWrapper>
                            )}
                          </form.Field>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        field.pushValue({
                          nama: "",
                          tipe_posisi: "",
                          posisi: "",
                          ttd: "",
                        })
                      }
                    >
                      <PlusIcon className="mr-1 size-4" />
                      Tambah Petugas
                    </Button>
                  </div>
                )}
              </form.Field>
            </section>

            <Separator />

            {/* ===== Submit ===== */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                Kembali
              </Button>
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Simpan"}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
