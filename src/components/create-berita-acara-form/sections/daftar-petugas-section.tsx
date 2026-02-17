import { PlusIcon } from "lucide-react";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrayRowShell } from "../array-row-shell";
import { FieldWrapper } from "../field-wrapper";
import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type DaftarPetugasSectionProps = {
  form: CreateBeritaAcaraFormApi;
};

export function DaftarPetugasSection({ form }: DaftarPetugasSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Daftar Petugas</h2>
      <form.Field name="daftar_petugas" mode="array">
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
                  <form.Field name={`daftar_petugas[${index}].nama`}>
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

                  <form.Field name={`daftar_petugas[${index}].tipe_posisi`}>
                    {(subField) => (
                      <FieldWrapper label="Tipe Posisi">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Tipe posisi"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`daftar_petugas[${index}].posisi`}>
                    {(subField) => (
                      <FieldWrapper label="Posisi">
                        <Input
                          value={subField.state.value}
                          onChange={(e) => subField.handleChange(e.target.value)}
                          onBlur={subField.handleBlur}
                          placeholder="Posisi"
                        />
                      </FieldWrapper>
                    )}
                  </form.Field>

                  <form.Field name={`daftar_petugas[${index}].ttd`}>
                    {(subField) => (
                      <FieldWrapper label="Tanda Tangan">
                        <FileUpload
                          value={subField.state.value}
                          onChange={(value) => subField.handleChange(value)}
                          label="Upload TTD"
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
  );
}
