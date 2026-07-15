import type { ResumeData } from "../types/resume";

export const STORAGE_KEY = "beetales_resume_builder_data";

export function loadResume(): ResumeData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || !("version" in parsed) || !("personal" in parsed)) return null;
    const resume = parsed as ResumeData;
    if (resume.version === 1) {
      return { ...resume, version: 2, language: "en" };
    }
    return resume;
  } catch {
    return null;
  }
}

export function saveResume(data: ResumeData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearResume(): void {
  localStorage.removeItem(STORAGE_KEY);
}
