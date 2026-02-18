"use server";

import { db } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { uploadImageToStorage } from "./helpers";

export async function saveBeritaAcara(
  data: Record<string, unknown>
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  try {
    // Deep-clone to strip any proxy / non-plain wrappers that Next.js
    // server-action serialisation may introduce.
    const converted: Record<string, unknown> = JSON.parse(
      JSON.stringify(data)
    );

    const dateFields = ["ba_date", "dasar_tanggal", "tanggal_dibuat"] as const;

    for (const field of dateFields) {
      const value = converted[field];
      if (typeof value === "string") {
        converted[field] = Timestamp.fromDate(new Date(value));
      } else {
        converted[field] = null;
      }
    }

    // Ensure every array field contains only plain objects
    const arrayFields = [
      "pengukuran_dihadiri",
      "batas_bidang_tanah",
      "penggunaan_tanah",
      "tanah_terdampak",
      "daftar_petugas",
    ] as const;

    for (const field of arrayFields) {
      const arr = converted[field];
      if (Array.isArray(arr)) {
        converted[field] = arr.map((item: Record<string, unknown>) => ({
          ...item,
        }));
      }
    }

    const docRef = db.collection("berita-acara").doc();

    if (Array.isArray(converted.pengukuran_dihadiri)) {
      converted.pengukuran_dihadiri = await Promise.all(
        converted.pengukuran_dihadiri.map(async (item, index) => {
          if (!item || typeof item !== "object") {
            return item;
          }

          const record = item as Record<string, unknown>;
          return {
            ...record,
            foto: await uploadImageToStorage(
              record.foto,
              `pengukuran_dihadiri[${index}].foto`
            ),
          };
        })
      );
    }

    if (Array.isArray(converted.batas_bidang_tanah)) {
      converted.batas_bidang_tanah = await Promise.all(
        converted.batas_bidang_tanah.map(async (item, index) => {
          if (!item || typeof item !== "object") {
            return item;
          }

          const record = item as Record<string, unknown>;
          return {
            ...record,
            foto: await uploadImageToStorage(
              record.foto,
              `batas_bidang_tanah[${index}].foto`
            ),
          };
        })
      );
    }

    if (Array.isArray(converted.daftar_petugas)) {
      converted.daftar_petugas = await Promise.all(
        converted.daftar_petugas.map(async (item, index) => {
          if (!item || typeof item !== "object") {
            return item;
          }

          const record = item as Record<string, unknown>;
          return {
            ...record,
            ttd: await uploadImageToStorage(
              record.ttd,
              `daftar_petugas[${index}].ttd`
            ),
          };
        })
      );
    }

    converted.gambar_denah_area = await uploadImageToStorage(
      converted.gambar_denah_area,
      "gambar_denah_area"
    );

    await docRef.set({
      ...converted,
      imageStorageVersion: 2,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
