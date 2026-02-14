import { generateDocxReport } from "@/lib/docx";
import path from "node:path";

export const runtime = "nodejs";

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const data =
      payload && typeof payload === "object" && "data" in payload
        ? (payload.data as Record<string, unknown>)
        : {};

    const templateFile =
      payload && typeof payload === "object" && "template" in payload
        ? String(payload.template)
        : undefined;

    const { buffer, fileName } = await generateDocxReport({
      data,
      templateFile,
    });

    const downloadName = sanitizeFileName(path.basename(fileName));

    return new Response(buffer, {
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
