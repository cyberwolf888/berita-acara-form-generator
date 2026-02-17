import { FileUpload } from "@/components/file-upload";

import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type GambarDenahAreaSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function GambarDenahAreaSection({ form }: GambarDenahAreaSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Gambar Denah Area</h2>
      <form.Field name="gambar_denah_area">
        {(field) => (
          <FieldWrapper label="Denah Area">
            <FileUpload
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
              label="Upload Denah Area"
            />
          </FieldWrapper>
        )}
      </form.Field>
    </section>
  );
}
