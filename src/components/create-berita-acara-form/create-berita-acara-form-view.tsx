import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { type CreateBeritaAcaraFormApi } from "./use-create-berita-acara-form";
import { BatasBidangTanahSection } from "./sections/batas-bidang-tanah-section";
import { DaftarPetugasSection } from "./sections/daftar-petugas-section";
import { DasarPengukuranSection } from "./sections/dasar-pengukuran-section";
import { GambarDenahAreaSection } from "./sections/gambar-denah-area-section";
import { InfoUmumSection } from "./sections/info-umum-section";
import { LokasiSection } from "./sections/lokasi-section";
import { PenggunaanTanahSection } from "./sections/penggunaan-tanah-section";
import { PengukuranDihadiriSection } from "./sections/pengukuran-dihadiri-section";
import { SubmitActions } from "./sections/submit-actions";
import { TanahTerdampakSection } from "./sections/tanah-terdampak-section";
import { TempatTanggalSection } from "./sections/tempat-tanggal-section";

type CreateBeritaAcaraFormViewProps = {
  form: CreateBeritaAcaraFormApi;
  onBack: () => void;
};

export function CreateBeritaAcaraFormView({
  form,
  onBack,
}: CreateBeritaAcaraFormViewProps) {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeftIcon className="mr-1 h-4 w-4" />
            Kembali
          </Button>
          <CardTitle className="text-2xl">Buat Berita Acara</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <InfoUmumSection form={form} />
          <Separator />

          <LokasiSection form={form} />
          <Separator />

          <DasarPengukuranSection form={form} />
          <Separator />

          <TempatTanggalSection form={form} />
          <Separator />

          <PengukuranDihadiriSection form={form} />
          <Separator />

          <BatasBidangTanahSection form={form} />
          <Separator />

          <PenggunaanTanahSection form={form} />
          <Separator />

          <TanahTerdampakSection form={form} />
          <Separator />

          <DaftarPetugasSection form={form} />
          <Separator />

          <GambarDenahAreaSection form={form} />
          <Separator />

          <SubmitActions form={form} onBack={onBack} />
        </form>
      </CardContent>
    </Card>
  );
}
