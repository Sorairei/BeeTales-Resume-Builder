export const FIXED_SECTION_IDS = [
  "summary",
  "experience",
  "education",
  "skills",
  "languages",
  "certifications",
  "projects",
  "courses",
  "references",
] as const;

export function normalizeSectionOrder(order: string[], customIds: string[]): string[] {
  const validIds = [...FIXED_SECTION_IDS, ...customIds];
  const valid = new Set(validIds);
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const id of order) {
    if (!valid.has(id) || seen.has(id)) continue;
    seen.add(id);
    normalized.push(id);
  }

  for (const id of validIds) {
    if (seen.has(id)) continue;
    seen.add(id);
    normalized.push(id);
  }

  return normalized;
}

export function normalizeHiddenSections(hidden: string[], sectionOrder: string[]): string[] {
  const valid = new Set(sectionOrder);
  return [...new Set(hidden.filter((id) => valid.has(id)))];
}
