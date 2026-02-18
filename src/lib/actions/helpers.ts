import { bucket, storageBucketName } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

import type {
  BatasBidangTanahPrintItem,
  DaftarPetugasPrintItem,
  DocxTemplateImage,
  PengukuranDihadiriPrintItem,
} from "./types";

import {
  DOCX_FALLBACK_IMAGE_BASE64,
  DOCX_IMAGE_DIMENSION_CM,
  DOCX_MIME_TO_EXTENSION,
  EXTENSION_TO_DOCX,
  longDateFormatter,
  monthNameFormatter,
  numericDateFormatter,
  weekdayFormatter,
} from "./constants";

// ---------------------------------------------------------------------------
// Text / date utilities
// ---------------------------------------------------------------------------

export function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function asDocxItemNo(value: unknown, fallbackNo: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  const no = asText(value).trim();
  return no || String(fallbackNo);
}

export function asDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (value instanceof Timestamp) {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function buildDocxDatePayload(dateValue: unknown) {
  const date = asDate(dateValue) ?? new Date();
  const dateNumber = String(date.getDate()).padStart(2, "0");
  const monthNumber = String(date.getMonth() + 1).padStart(2, "0");
  const yearNumber = date.getFullYear();

  return {
    day: weekdayFormatter.format(date),
    date: dateNumber,
    month: monthNameFormatter.format(date),
    year: yearNumber,

    // Backward-compatible keys used by existing templates.
    today: numericDateFormatter.format(date),
    day_number: dateNumber,
    month_number: monthNumber,
    year_string: String(yearNumber),
  };
}

export function formatLongDate(dateValue: unknown) {
  const date = asDate(dateValue);
  return date ? longDateFormatter.format(date) : "";
}

// ---------------------------------------------------------------------------
// Image helpers
// ---------------------------------------------------------------------------

export function createFallbackDocxImage(): DocxTemplateImage {
  return {
    data: DOCX_FALLBACK_IMAGE_BASE64,
    extension: ".png",
    width: DOCX_IMAGE_DIMENSION_CM,
    height: DOCX_IMAGE_DIMENSION_CM,
  };
}

function normalizeStorageObjectPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("gs://")) {
    const withoutScheme = trimmed.slice(5);
    const slashIndex = withoutScheme.indexOf("/");

    if (slashIndex === -1) {
      return "";
    }

    const candidateBucket = withoutScheme.slice(0, slashIndex);
    if (candidateBucket !== storageBucketName) {
      return "";
    }

    return withoutScheme.slice(slashIndex + 1).replace(/^\/+/, "");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return "";
  }

  return trimmed.replace(/^\/+/, "");
}

export function parseImageDataUrl(value: string) {
  const dataUriMatch = value.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!dataUriMatch) {
    return null;
  }

  const mimeType = dataUriMatch[1].toLowerCase();
  const extension = DOCX_MIME_TO_EXTENSION[mimeType];
  if (!mimeType.startsWith("image/") || !extension) {
    return null;
  }

  const base64Payload = dataUriMatch[2].replace(/\s+/g, "");
  if (!base64Payload) {
    return null;
  }

  const isValidBase64 =
    base64Payload.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(base64Payload);

  if (!isValidBase64) {
    return null;
  }

  return {
    mimeType,
    extension,
    base64Payload,
  };
}

function getDocxExtensionFromPath(pathValue: string): DocxTemplateImage["extension"] | null {
  const extensionRaw = pathValue.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TO_DOCX[extensionRaw] ?? null;
}

async function loadStorageDocxImage(pathValue: string): Promise<DocxTemplateImage> {
  const normalizedPath = normalizeStorageObjectPath(pathValue);
  if (!normalizedPath) {
    return createFallbackDocxImage();
  }

  try {
    const file = bucket.file(normalizedPath);
    const [exists] = await file.exists();
    if (!exists) {
      return createFallbackDocxImage();
    }

    const [metadata] = await file.getMetadata();
    const contentType = asText(metadata.contentType).toLowerCase();
    const extensionFromMime = DOCX_MIME_TO_EXTENSION[contentType];
    const extension = extensionFromMime ?? getDocxExtensionFromPath(normalizedPath);

    if (!extension) {
      return createFallbackDocxImage();
    }

    const [buffer] = await file.download();
    const base64Payload = buffer.toString("base64");
    if (!base64Payload) {
      return createFallbackDocxImage();
    }

    return {
      data: base64Payload,
      extension,
      width: DOCX_IMAGE_DIMENSION_CM,
      height: DOCX_IMAGE_DIMENSION_CM,
    };
  } catch {
    return createFallbackDocxImage();
  }
}

export async function normalizeDocxImage(value: unknown): Promise<DocxTemplateImage> {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const existingData = asText(record.data).trim().replace(/\s+/g, "");
    const existingExtension = asText(record.extension).toLowerCase() as
      | DocxTemplateImage["extension"]
      | "";

    if (
      existingData &&
      (existingExtension === ".png" ||
        existingExtension === ".jpg" ||
        existingExtension === ".jpeg" ||
        existingExtension === ".gif")
    ) {
      return {
        data: existingData,
        extension: existingExtension,
        width: DOCX_IMAGE_DIMENSION_CM,
        height: DOCX_IMAGE_DIMENSION_CM,
      };
    }

    if (
      record.kind === "new-upload" &&
      typeof record.dataUrl === "string" &&
      record.dataUrl.trim()
    ) {
      const parsedDataUrl = parseImageDataUrl(record.dataUrl.trim());
      if (parsedDataUrl) {
        return {
          data: parsedDataUrl.base64Payload,
          extension: parsedDataUrl.extension,
          width: DOCX_IMAGE_DIMENSION_CM,
          height: DOCX_IMAGE_DIMENSION_CM,
        };
      }
    }
  }

  const raw = asText(value).trim();

  if (!raw) {
    return createFallbackDocxImage();
  }

  const parsedDataUrl = parseImageDataUrl(raw);
  if (parsedDataUrl) {
    return {
      data: parsedDataUrl.base64Payload,
      extension: parsedDataUrl.extension,
      width: DOCX_IMAGE_DIMENSION_CM,
      height: DOCX_IMAGE_DIMENSION_CM,
    };
  }

  return loadStorageDocxImage(raw);
}

// ---------------------------------------------------------------------------
// Upload helpers
// ---------------------------------------------------------------------------

function parseIncomingImageValue(value: unknown, fieldPath: string) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) {
      return null;
    }

    const normalizedPath = normalizeStorageObjectPath(raw);
    if (normalizedPath) {
      return normalizedPath;
    }

    throw new Error(`${fieldPath} harus berupa path Storage yang valid.`);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    const storagePath = asText(record.storagePath).trim();
    if (storagePath) {
      const normalizedPath = normalizeStorageObjectPath(storagePath);
      if (!normalizedPath) {
        throw new Error(`${fieldPath} memiliki path Storage yang tidak valid.`);
      }

      return normalizedPath;
    }

    if (record.kind === "uploading") {
      throw new Error(`${fieldPath} masih dalam proses upload.`);
    }
  }

  throw new Error(`${fieldPath} memiliki format gambar yang tidak didukung.`);
}

export async function uploadImageToStorage(
  value: unknown,
  fieldPath: string
) {
  const parsed = parseIncomingImageValue(value, fieldPath);
  if (!parsed) {
    return "";
  }

  return parsed;
}

// ---------------------------------------------------------------------------
// Array normalizers (for print data)
// ---------------------------------------------------------------------------

export async function normalizePengukuranDihadiri(
  value: unknown
): Promise<PengukuranDihadiriPrintItem[]> {
  if (!Array.isArray(value)) {
    return [];
  }

  return Promise.all(
    value.map(async (item, index) => {
      const fallbackNo = index + 1;

      if (!item || typeof item !== "object") {
        return {
          no: String(fallbackNo),
          nama: "",
          foto: createFallbackDocxImage(),
        };
      }

      const record = item as Record<string, unknown>;
      return {
        no: asDocxItemNo(record.no, fallbackNo),
        nama: asText(record.nama),
        foto: await normalizeDocxImage(record.foto),
      };
    })
  );
}

export async function normalizeBatasBidangTanah(
  value: unknown
): Promise<BatasBidangTanahPrintItem[]> {
  if (!Array.isArray(value)) {
    return [];
  }

  return Promise.all(
    value.map(async (item, index) => {
      const fallbackNo = index + 1;

      if (!item || typeof item !== "object") {
        return {
          no: String(fallbackNo),
          jenis: "",
          keterangan: "",
          foto: createFallbackDocxImage(),
        };
      }

      const record = item as Record<string, unknown>;
      return {
        no: asDocxItemNo(record.no, fallbackNo),
        jenis: asText(record.jenis),
        keterangan: asText(record.keterangan),
        foto: await normalizeDocxImage(record.foto),
      };
    })
  );
}

export async function normalizeDaftarPetugas(
  value: unknown
): Promise<DaftarPetugasPrintItem[]> {
  if (!Array.isArray(value)) {
    return [];
  }

  return Promise.all(
    value.map(async (item, index) => {
      const fallbackNo = index + 1;

      if (!item || typeof item !== "object") {
        return {
          no: String(fallbackNo),
          nama: "",
          tipe_posisi: "",
          posisi: "",
          ttd: createFallbackDocxImage(),
        };
      }

      const record = item as Record<string, unknown>;
      return {
        no: asDocxItemNo(record.no, fallbackNo),
        nama: asText(record.nama),
        tipe_posisi: asText(record.tipe_posisi),
        posisi: asText(record.posisi),
        ttd: await normalizeDocxImage(record.ttd),
      };
    })
  );
}
