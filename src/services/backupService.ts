import { z } from "zod";
import type { ResumeData } from "../types/resume";
import { resumeBackupFileName } from "../utils/fileNames";
import { migrateResumeData } from "../utils/migrations";

const MAX_BACKUP_SIZE = 8 * 1024 * 1024;
const MAX_PHOTO_DATA_LENGTH = 4 * 1024 * 1024;
const backupEnvelopeSchema = z.object({
  format: z.literal("beetales-resume-builder"),
  backupVersion: z.literal(1),
  exportedAt: z.string().max(60),
  resume: z.unknown(),
  photo: z.string().max(MAX_PHOTO_DATA_LENGTH).regex(/^data:image\/(jpeg|png|webp);base64,/).optional(),
});

export interface ImportedBackup { resume: ResumeData; photo?: Blob; }

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("export-failed"));
    reader.onerror = () => reject(new Error("export-failed"));
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [metadata, encoded] = dataUrl.split(",", 2);
  if (!metadata || !encoded) throw new Error("invalid-photo");
  const mimeType = metadata.match(/^data:(image\/(?:jpeg|png|webp));base64$/)?.[1];
  if (!mimeType) throw new Error("invalid-photo");
  try {
    const binary = atob(encoded);
    if (binary.length > 3 * 1024 * 1024) throw new Error("invalid-photo");
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new Blob([bytes], { type: mimeType });
  } catch { throw new Error("invalid-photo"); }
}

export async function createBackupJson(resume: ResumeData, photo: Blob | null): Promise<{ content: string; fileName: string }> {
  const envelope = {
    format: "beetales-resume-builder",
    backupVersion: 1,
    exportedAt: new Date().toISOString(),
    resume,
    ...(photo ? { photo: await blobToDataUrl(photo) } : {}),
  };
  return { content: JSON.stringify(envelope, null, 2), fileName: resumeBackupFileName(resume.personal.fullName) };
}

export function downloadBackup(content: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: "application/json;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = fileName; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function readBackupFile(file: File): Promise<ImportedBackup> {
  if (file.size > MAX_BACKUP_SIZE) throw new Error("file-too-large");
  let parsed: unknown;
  try { parsed = JSON.parse(await file.text()); } catch { throw new Error("invalid-json"); }

  const envelopeResult = backupEnvelopeSchema.safeParse(parsed);
  if (envelopeResult.success) {
    return { resume: migrateResumeData(envelopeResult.data.resume), photo: envelopeResult.data.photo ? dataUrlToBlob(envelopeResult.data.photo) : undefined };
  }
  try { return { resume: migrateResumeData(parsed) }; }
  catch (error) { throw error instanceof Error ? error : new Error("invalid-structure"); }
}
