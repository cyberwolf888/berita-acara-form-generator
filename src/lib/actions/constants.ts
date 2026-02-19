import type { DocxTemplateImage } from "./types";

export const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
});

export const monthNameFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
});

export const numericDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const longDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const DOCX_FALLBACK_IMAGE_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO2Yw0YAAAAASUVORK5CYII=";

export const DOCX_IMAGE_DIMENSION_CM = 7;
export const DOCX_SIGNATURE_IMAGE_DIMENSION_CM = 2;
export const DOCX_DENAH_IMAGE_WIDTH_CM = 14;
export const DOCX_DENAH_IMAGE_HEIGHT_CM = 10;
export const DEFAULT_STORAGE_IMAGES_PREFIX = "images";

export const DOCX_MIME_TO_EXTENSION: Record<string, DocxTemplateImage["extension"]> =
  {
    "image/png": ".png",
    "image/jpeg": ".jpeg",
    "image/jpg": ".jpg",
    "image/gif": ".gif",
  };

export const EXTENSION_TO_DOCX: Record<string, DocxTemplateImage["extension"]> = {
  png: ".png",
  jpg: ".jpg",
  jpeg: ".jpeg",
  gif: ".gif",
};

export const MAX_UPLOAD_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
