import { type FormData } from "./types";

const IMAGE_UPLOAD_CONCURRENCY = 3;

type SignedUploadPayload = {
  uploadUrl: string;
  storagePath: string;
  expiresAt: string;
};

function isPendingImageValue(value: FormData["gambar_denah_area"]) {
  return typeof value === "object" && value.kind === "pending";
}

async function requestSignedUploadUrl(
  image: Extract<FormData["gambar_denah_area"], { kind: "pending" }>,
  fieldPath: string
) {
  const signedResponse = await fetch("/api/storage/signed-upload-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: image.fileName,
      mimeType: image.mimeType,
      size: image.size,
      fieldPath,
    }),
  });

  if (!signedResponse.ok) {
    const errorPayload = (await signedResponse.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(errorPayload?.error || "Gagal menyiapkan upload.");
  }

  const signedPayload = (await signedResponse.json()) as SignedUploadPayload;
  if (!signedPayload.uploadUrl || !signedPayload.storagePath) {
    throw new Error("Respon upload URL tidak valid.");
  }

  return signedPayload;
}

async function uploadPendingImage(
  image: Extract<FormData["gambar_denah_area"], { kind: "pending" }>,
  fieldPath: string
): Promise<Extract<FormData["gambar_denah_area"], { kind: "uploaded" }>> {
  const signedPayload = await requestSignedUploadUrl(image, fieldPath);

  const uploadResponse = await fetch(signedPayload.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": image.mimeType,
    },
    body: image.file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload gagal untuk ${fieldPath}.`);
  }

  return {
    kind: "uploaded",
    storagePath: signedPayload.storagePath,
    fileName: image.fileName,
    mimeType: image.mimeType,
    size: image.size,
    previewUrl: image.previewUrl,
  };
}

async function runWithConcurrency<T>(
  values: T[],
  concurrency: number,
  task: (value: T) => Promise<void>
) {
  if (values.length === 0) {
    return;
  }

  const normalizedConcurrency = Math.max(1, Math.min(concurrency, values.length));
  let cursor = 0;
  let firstError: Error | null = null;

  const worker = async () => {
    while (true) {
      if (firstError) {
        return;
      }

      const currentIndex = cursor;
      cursor += 1;

      if (currentIndex >= values.length) {
        return;
      }

      try {
        await task(values[currentIndex]);
      } catch (error) {
        firstError =
          error instanceof Error ? error : new Error("Terjadi kesalahan upload.");
        return;
      }
    }
  };

  await Promise.all(Array.from({ length: normalizedConcurrency }, () => worker()));

  if (firstError) {
    throw firstError;
  }
}

type UploadTask = {
  image: Extract<FormData["gambar_denah_area"], { kind: "pending" }>;
  fieldPath: string;
  assign: (nextValue: Extract<FormData["gambar_denah_area"], { kind: "uploaded" }>) => void;
};

export async function uploadPendingImagesOnSubmit(value: FormData): Promise<FormData> {
  const preparedValue: FormData = {
    ...value,
    pengukuran_dihadiri: value.pengukuran_dihadiri.map((item) => ({ ...item })),
    batas_bidang_tanah: value.batas_bidang_tanah.map((item) => ({ ...item })),
    penggunaan_tanah: value.penggunaan_tanah.map((item) => ({ ...item })),
    tanah_terdampak: value.tanah_terdampak.map((item) => ({ ...item })),
    daftar_petugas: value.daftar_petugas.map((item) => ({ ...item })),
  };

  const tasks: UploadTask[] = [];

  if (isPendingImageValue(preparedValue.gambar_denah_area)) {
    tasks.push({
      image: preparedValue.gambar_denah_area,
      fieldPath: "gambar_denah_area",
      assign: (uploadedValue) => {
        preparedValue.gambar_denah_area = uploadedValue;
      },
    });
  }

  preparedValue.pengukuran_dihadiri.forEach((item, index) => {
    if (!isPendingImageValue(item.foto)) {
      return;
    }

    tasks.push({
      image: item.foto,
      fieldPath: `pengukuran_dihadiri[${index}].foto`,
      assign: (uploadedValue) => {
        preparedValue.pengukuran_dihadiri[index].foto = uploadedValue;
      },
    });
  });

  preparedValue.batas_bidang_tanah.forEach((item, index) => {
    if (!isPendingImageValue(item.foto)) {
      return;
    }

    tasks.push({
      image: item.foto,
      fieldPath: `batas_bidang_tanah[${index}].foto`,
      assign: (uploadedValue) => {
        preparedValue.batas_bidang_tanah[index].foto = uploadedValue;
      },
    });
  });

  preparedValue.daftar_petugas.forEach((item, index) => {
    if (!isPendingImageValue(item.ttd)) {
      return;
    }

    tasks.push({
      image: item.ttd,
      fieldPath: `daftar_petugas[${index}].ttd`,
      assign: (uploadedValue) => {
        preparedValue.daftar_petugas[index].ttd = uploadedValue;
      },
    });
  });

  await runWithConcurrency(tasks, IMAGE_UPLOAD_CONCURRENCY, async (task) => {
    const uploadedValue = await uploadPendingImage(task.image, task.fieldPath);
    task.assign(uploadedValue);
  });

  return preparedValue;
}

function serializeImageValue(value: FormData["gambar_denah_area"]) {
  if (!value || typeof value === "string") {
    return "";
  }

  if (value.kind !== "uploaded") {
    return "";
  }

  return {
    kind: "uploaded" as const,
    storagePath: value.storagePath,
    fileName: value.fileName,
    mimeType: value.mimeType,
    size: value.size,
  };
}

export function serializeFormValues(value: FormData): Record<string, unknown> {
  return {
    ...value,
    ba_date: value.ba_date?.toISOString() ?? null,
    dasar_tanggal: value.dasar_tanggal?.toISOString() ?? null,
    tanggal_dibuat: value.tanggal_dibuat?.toISOString() ?? null,
    gambar_denah_area: serializeImageValue(value.gambar_denah_area),
    pengukuran_dihadiri: value.pengukuran_dihadiri.map((item) => ({
      nama: item.nama,
      foto: serializeImageValue(item.foto),
    })),
    batas_bidang_tanah: value.batas_bidang_tanah.map((item) => ({
      jenis: item.jenis,
      foto: serializeImageValue(item.foto),
      keterangan: item.keterangan,
    })),
    penggunaan_tanah: value.penggunaan_tanah.map((item) => ({
      no_hak: item.no_hak,
      penggunaan: item.penggunaan,
    })),
    tanah_terdampak: value.tanah_terdampak.map((item) => ({
      nib: item.nib,
      luas_sebelum: item.luas_sebelum,
      luas_sesudah: item.luas_sesudah,
      keterangan: item.keterangan,
    })),
    daftar_petugas: value.daftar_petugas.map((item) => ({
      nama: item.nama,
      tipe_posisi: item.tipe_posisi,
      posisi: item.posisi,
      ttd: serializeImageValue(item.ttd),
    })),
  };
}

export function hasRequiredTopFields(value: FormData) {
  return (
    Boolean(value.ba_date) &&
    value.full_name.trim().length > 0 &&
    value.tempat_dibuat.trim().length > 0 &&
    Boolean(value.tanggal_dibuat)
  );
}

export function hasPendingUploads(value: FormData) {
  if (typeof value.gambar_denah_area === "object") {
    if (value.gambar_denah_area.kind === "pending") {
      return true;
    }
  }

  for (const item of value.pengukuran_dihadiri) {
    if (typeof item.foto === "object" && item.foto.kind === "pending") {
      return true;
    }
  }

  for (const item of value.batas_bidang_tanah) {
    if (typeof item.foto === "object" && item.foto.kind === "pending") {
      return true;
    }
  }

  for (const item of value.daftar_petugas) {
    if (typeof item.ttd === "object" && item.ttd.kind === "pending") {
      return true;
    }
  }

  return false;
}
