import { Button } from "@/components/ui/button";

import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type SubmitActionsProps = {
  form: CreateBeritaAcaraFormApi;
  onBack: () => void;
};

export function SubmitActions({ form, onBack }: SubmitActionsProps) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onBack}>
        Kembali
      </Button>
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
      </form.Subscribe>
    </div>
  );
}
