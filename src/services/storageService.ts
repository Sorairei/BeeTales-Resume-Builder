import type { ResumeData } from "../types/resume";
import { migrateResumeData } from "../utils/migrations";

export const STORAGE_KEY = "beetales_resume_builder_data";

export function loadResume(): ResumeData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed: unknown = JSON.parse(stored);
    return migrateResumeData(parsed);
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
