import { randomUUID } from "node:crypto";

import {
  DEFAULT_STORAGE_IMAGES_PREFIX,
  DOCX_MIME_TO_EXTENSION,
  MAX_UPLOAD_IMAGE_SIZE_BYTES,
} from "@/lib/actions/constants";
import { bucket } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const SIGNED_UPLOAD_TTL_MS = 5 * 60 * 1000;

function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}

function toStorageSafeSegment(value: string) {
  return value
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getImagesPrefix() {
  return (
    process.env.FIREBASE_STORAGE_IMAGES_PREFIX?.trim().replace(/^\/+|\/+$/g, "") ||
    DEFAULT_STORAGE_IMAGES_PREFIX
  );
}

type SignedUploadRequest = {
  fileName?: unknown;
  mimeType?: unknown;
  size?: unknown;
  fieldPath?: unknown;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as SignedUploadRequest;
    const fileName = asText(payload.fileName).trim();
    const mimeType = asText(payload.mimeType).trim().toLowerCase();
    const fieldPath = asText(payload.fieldPath).trim();
    const size = typeof payload.size === "number" ? payload.size : Number(payload.size);

    if (!fileName || !mimeType || !fieldPath) {
      return Response.json(
        { error: "Informasi file tidak lengkap." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(size) || size <= 0) {
      return Response.json({ error: "Ukuran file tidak valid." }, { status: 400 });
    }

    if (size > MAX_UPLOAD_IMAGE_SIZE_BYTES) {
      return Response.json(
        { error: "Ukuran file melebihi batas maksimum 10 MB." },
        { status: 400 }
      );
    }

    const extension = DOCX_MIME_TO_EXTENSION[mimeType];
    if (!mimeType.startsWith("image/") || !extension) {
      return Response.json(
        { error: "Format file harus PNG/JPG/JPEG/GIF." },
        { status: 400 }
      );
    }

    const prefix = getImagesPrefix();
    const safeFieldPath = toStorageSafeSegment(fieldPath) || "image";
    const objectPath = `${prefix}/temp/${randomUUID()}/${safeFieldPath}-${randomUUID()}${extension}`;
    const expiresAtMs = Date.now() + SIGNED_UPLOAD_TTL_MS;

    const [uploadUrl] = await bucket.file(objectPath).getSignedUrl({
      version: "v4",
      action: "write",
      expires: expiresAtMs,
      contentType: mimeType,
    });

    return Response.json({
      uploadUrl,
      storagePath: objectPath,
      expiresAt: new Date(expiresAtMs).toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 400 });
  }
}