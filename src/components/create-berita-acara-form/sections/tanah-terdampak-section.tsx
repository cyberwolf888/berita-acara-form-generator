import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrayRowShell } from "../array-row-shell";
import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type TanahTerdampakSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function TanahTerdampakSection({ form }: TanahTerdampakSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Tanah Terdampak</h2>
      <form.Field name="tanah_terdampak" mode="array">
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
                  <form.Field name={`tanah_terdampak[${index}].nib`}>
                    {(subField) => (
                      <FieldWrapper label="NIB">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="NIB"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`tanah_terdampak[${index}].luas_sebelum`}>
                    {(subField) => (
                      <FieldWrapper label="Luas Sebelum">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Luas sebelum"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`tanah_terdampak[${index}].luas_sesudah`}>
                    {(subField) => (
                      <FieldWrapper label="Luas Sesudah">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Luas sesudah"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`tanah_terdampak[${index}].keterangan`}>
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
  );
}
