function safeName(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "resume";
}

export function resumeBackupFileName(fullName: string, date = new Date()): string {
  return `beetales-resume-${safeName(fullName)}-${date.toISOString().slice(0, 10)}.json`;
}

export function resumePdfFileName(fullName: string): string {
  return `resume-${safeName(fullName)}.pdf`;
}

export function textResumeFileName(fullName: string, extension: "yaml" | "md"): string {
  return `${safeName(fullName)}.${extension}`;
}
