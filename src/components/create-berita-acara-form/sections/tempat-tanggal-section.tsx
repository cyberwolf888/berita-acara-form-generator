import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";

import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type TempatTanggalSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function TempatTanggalSection({ form }: TempatTanggalSectionProps) {
  return (
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
  );
}
