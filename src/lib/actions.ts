"use server";

import { db } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

/**
 * Add a document to a Firestore collection.
 * Returns the newly created document ID.
 */
export async function addDocument(
  collection: string,
  data: Record<string, unknown>
) {
  const docRef = await db.collection(collection).add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { id: docRef.id };
}

/**
 * Get all documents from a Firestore collection.
 * Ordered by creation time (newest first).
 */
export async function getDocuments(collection: string) {
  const snapshot = await db
    .collection(collection)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Get a single document by ID from a Firestore collection.
 */
export async function getDocument(collection: string, id: string) {
  const doc = await db.collection(collection).doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return { id: doc.id, ...doc.data() };
}

/**
 * Update a document in a Firestore collection.
 */
export async function updateDocument(
  collection: string,
  id: string,
  data: Record<string, unknown>
) {
  await db
    .collection(collection)
    .doc(id)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  return { id };
}

/**
 * Delete a document from a Firestore collection.
 */
export async function deleteDocument(collection: string, id: string) {
  await db.collection(collection).doc(id).delete();
  return { id };
}

/**
 * Save a Berita Acara form submission.
 * Converts ISO date strings to Firestore Timestamps.
 */
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

    const docRef = await db.collection("berita-acara").add({
      ...converted,
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
