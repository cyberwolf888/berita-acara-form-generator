import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrayRowShell } from "../array-row-shell";
import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type PenggunaanTanahSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function PenggunaanTanahSection({ form }: PenggunaanTanahSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Penggunaan Tanah</h2>
      <form.Field name="penggunaan_tanah" mode="array">
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
                  <form.Field name={`penggunaan_tanah[${index}].no_hak`}>
                    {(subField) => (
                      <FieldWrapper label="No. Hak">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="No. hak"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`penggunaan_tanah[${index}].penggunaan`}>
                    {(subField) => (
                      <FieldWrapper label="Penggunaan">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Penggunaan"
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
              onClick={() => field.pushValue({ no_hak: "", penggunaan: "" })}
            >
              <PlusIcon className="mr-1 size-4" />
              Tambah Penggunaan Tanah
            </Button>
          </div>
        )}
      </form.Field>
    </section>
  );
}
