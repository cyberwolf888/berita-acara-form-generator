import "server-only";

import { createReport } from "docx-templates";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

export type DocxTemplateData = Record<string, unknown>;

export type GenerateDocxOptions = {
  templateFile?: string;
  data: DocxTemplateData;
  cmdDelimiter?: [string, string];
};

const DEFAULT_TEMPLATE_FILE = "berita-acara.docx";

function resolveTemplatePath(templateFile?: string) {
  const safeName = path.basename(templateFile ?? DEFAULT_TEMPLATE_FILE);
  return path.join(process.cwd(), "src", "templates", safeName);
}

async function ensureTemplateExists(templatePath: string) {
  try {
    await access(templatePath);
  } catch {
    throw new Error(
      `DOCX template not found at ${templatePath}. Add a .docx template file in src/templates.`
    );
  }
}

export async function generateDocxReport(options: GenerateDocxOptions) {
  const templatePath = resolveTemplatePath(options.templateFile);
  await ensureTemplateExists(templatePath);

  const template = await readFile(templatePath);
  const buffer = await createReport({
    template,
    data: options.data,
    cmdDelimiter: options.cmdDelimiter,
  });

  return {
    buffer,
    fileName: path.basename(templatePath),
  };
}
