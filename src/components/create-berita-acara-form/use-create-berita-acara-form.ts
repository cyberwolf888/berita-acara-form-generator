"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { saveBeritaAcara } from "@/lib/actions";

import { defaultValues } from "./constants";
import { hasRequiredTopFields, serializeFormValues } from "./logic";

export function useCreateBeritaAcaraForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (!hasRequiredTopFields(value)) {
        toast.error("Tanggal BA dan Nama Lengkap wajib diisi.");
        return;
      }

      const result = await saveBeritaAcara(serializeFormValues(value));

      if (result.success) {
        toast.success("Berita acara berhasil disimpan!");
        form.reset();
        return;
      }

      toast.error("Gagal menyimpan berita acara.", {
        description: result.error,
      });
    },
  });

  const goHome = () => {
    router.push("/");
  };

  return {
    form,
    goHome,
  };
}

export type CreateBeritaAcaraFormApi =
  ReturnType<typeof useCreateBeritaAcaraForm>["form"];
