import { generateDocxReport } from "@/lib/docx";
import { getBeritaAcaraPrintData } from "@/lib/actions/get-berita-acara-print-data";
import path from "node:path";

export const runtime = "nodejs";

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const id =
      payload && typeof payload === "object" && "id" in payload
        ? String(payload.id)
        : "";

    if (!id.trim()) {
      throw new Error("ID dokumen wajib diisi.");
    }

    const templateFile =
      payload && typeof payload === "object" && "template" in payload
        ? String(payload.template)
        : undefined;

    const printData = await getBeritaAcaraPrintData(id);
    if (!printData.success) {
      throw new Error(printData.error);
    }

    const { buffer, fileName } = await generateDocxReport({
      data: printData.data,
      templateFile,
    });

    const downloadName = sanitizeFileName(path.basename(fileName));

    const responseBody = Uint8Array.from(buffer).buffer;

    return new Response(responseBody, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${downloadName}"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 400 });
  }
}
