import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";

import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type InfoUmumSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function InfoUmumSection({ form }: InfoUmumSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Info Umum</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field
          name="ba_date"
          validators={{
            onSubmit: ({ value }) =>
              value ? undefined : "Tanggal BA wajib diisi",
          }}
        >
          {(field) => (
            <FieldWrapper label="Tanggal BA">
              <DatePicker
                value={field.state.value}
                onChange={(date) => field.handleChange(date)}
              />
              {field.state.meta.errors.length > 0 ? (
                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
              ) : null}
            </FieldWrapper>
          )}
        </form.Field>

        <form.Field
          name="full_name"
          validators={{
            onSubmit: ({ value }) =>
              value.trim().length > 0 ? undefined : "Nama lengkap wajib diisi",
          }}
        >
          {(field) => (
            <FieldWrapper label="Nama Lengkap">
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Nama lengkap"
              />
              {field.state.meta.errors.length > 0 ? (
                <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
              ) : null}
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
  );
}
