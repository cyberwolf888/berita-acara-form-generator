import { Input } from "@/components/ui/input";

import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type LokasiSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function LokasiSection({ form }: LokasiSectionProps) {
  return (
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
  );
}
