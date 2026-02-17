import { PlusIcon } from "lucide-react";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrayRowShell } from "../array-row-shell";
import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type PengukuranDihadiriSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function PengukuranDihadiriSection({ form }: PengukuranDihadiriSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Pengukuran Dihadiri</h2>
      <form.Field name="pengukuran_dihadiri" mode="array">
        {(field) => (
          <div className="space-y-4">
            {field.state.value.map((_, index) => (
              <ArrayRowShell
                key={index}
                index={index}
                canRemove={field.state.value.length > 1}
                onRemove={() => field.removeValue(index)}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <form.Field name={`pengukuran_dihadiri[${index}].nama`}>
                    {(subField) => (
                      <FieldWrapper label="Nama">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Nama"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`pengukuran_dihadiri[${index}].foto`}>
                    {(subField) => (
                      <FieldWrapper label="Foto">
                        <FileUpload
                          value={subField.state.value}
                          onChange={(value) => subField.handleChange(value)}
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>
                </div>
              </ArrayRowShell>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => field.pushValue({ nama: "", foto: "" })}
            >
              <PlusIcon className="mr-1 size-4" />
              Tambah Pengukuran Dihadiri
            </Button>
          </div>
        )}
      </form.Field>
    </section>
  );
}
