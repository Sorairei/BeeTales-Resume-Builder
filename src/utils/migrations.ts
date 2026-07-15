import { emptyResume } from "../data/emptyResume";
import type { ResumeData } from "../types/resume";
import { resumeSchema } from "./resumeSchema";
import { normalizeHiddenSections, normalizeSectionOrder } from "./sectionOrder";

export const CURRENT_DATA_VERSION = 4;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function migrateResumeData(input: unknown): ResumeData {
  if (!isRecord(input)) throw new Error("invalid-structure");
  const version = input.version;
  if (typeof version !== "number" || !Number.isInteger(version)) throw new Error("invalid-version");
  if (version < 1 || version > CURRENT_DATA_VERSION) throw new Error("incompatible-version");

  const settings = isRecord(input.settings) ? input.settings : {};
  const personal = isRecord(input.personal) ? input.personal : {};
  const candidate = {
    ...structuredClone(emptyResume),
    ...input,
    version: CURRENT_DATA_VERSION,
    language: version === 1 ? "en" : (input.language ?? "en"),
    settings: { ...emptyResume.settings, ...settings },
    personal: { ...emptyResume.personal, ...personal },
    referenceMode: input.referenceMode ?? "full",
  };
  const result = resumeSchema.safeParse(candidate);
  if (!result.success) throw new Error("invalid-structure");
  const parsed = result.data as ResumeData;
  const sectionOrder = normalizeSectionOrder(parsed.sectionOrder, parsed.customSections.map((section) => section.id));
  return { ...parsed, sectionOrder, hiddenSections: normalizeHiddenSections(parsed.hiddenSections, sectionOrder) };
}
