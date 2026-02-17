import { Button } from "@/components/ui/button";

import { type CreateBeritaAcaraFormApi } from "../use-create-berita-acara-form";

type SubmitActionsProps = {
  form: CreateBeritaAcaraFormApi;
  onBack: () => void;
};

export function SubmitActions({ form, onBack }: SubmitActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button type="button" variant="outline" onClick={onBack}>
        Kembali
      </Button>
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        )}
      </form.Subscribe>
    </div>
  );
}
