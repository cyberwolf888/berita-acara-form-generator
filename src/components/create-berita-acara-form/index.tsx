"use client";

import { CreateBeritaAcaraFormView } from "./create-berita-acara-form-view";
import { useCreateBeritaAcaraForm } from "./use-create-berita-acara-form";

export default function CreateBeritaAcaraForm() {
  const { form, goHome } = useCreateBeritaAcaraForm();

  return <CreateBeritaAcaraFormView form={form} onBack={goHome} />;
}
