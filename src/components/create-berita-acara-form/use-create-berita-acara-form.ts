"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { saveBeritaAcara } from "@/lib/actions";

import { defaultValues } from "./constants";
import {
  hasRequiredTopFields,
  serializeFormValues,
  uploadPendingImagesOnSubmit,
} from "./logic";

export function useCreateBeritaAcaraForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      if (!hasRequiredTopFields(value)) {
        toast.error(
          "Tanggal BA, Nama Lengkap, Tempat Dibuat, dan Tanggal Dibuat wajib diisi."
        );
        return;
      }

      let preparedValue = value;

      try {
        preparedValue = await uploadPendingImagesOnSubmit(value);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal mengunggah gambar.";
        toast.error("Gagal mengunggah gambar.", {
          description: message,
        });
        return;
      }

      const result = await saveBeritaAcara(serializeFormValues(preparedValue));

      if (result.success) {
        toast.success("Berita acara berhasil disimpan!");
        router.push(`/reports/${result.id}`);
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
