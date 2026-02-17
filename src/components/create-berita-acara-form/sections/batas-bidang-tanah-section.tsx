import { PlusIcon } from "lucide-react";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrayRowShell } from "../array-row-shell";
import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type BatasBidangTanahSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function BatasBidangTanahSection({ form }: BatasBidangTanahSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Batas Bidang Tanah</h2>
      <form.Field name="batas_bidang_tanah" mode="array">
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
                  <form.Field name={`batas_bidang_tanah[${index}].jenis`}>
                    {(subField) => (
                      <FieldWrapper label="Jenis">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Jenis"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`batas_bidang_tanah[${index}].foto`}>
                    {(subField) => (
                      <FieldWrapper label="Foto">
                        <FileUpload
                          value={subField.state.value}
                          onChange={(value) => subField.handleChange(value)}
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`batas_bidang_tanah[${index}].keterangan`}>
                    {(subField) => (
                      <FieldWrapper label="Keterangan">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Keterangan"
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
  );
}
