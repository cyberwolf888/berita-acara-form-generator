"use server";

import { db } from "@/lib/firebase-admin";

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
