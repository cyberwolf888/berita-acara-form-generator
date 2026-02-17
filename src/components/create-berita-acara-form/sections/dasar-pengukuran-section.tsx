import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";

import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type DasarPengukuranSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function DasarPengukuranSection({ form }: DasarPengukuranSectionProps) {
  return (
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
  );
}
