export const TWO_COLUMN_SIDEBAR_SECTIONS = new Set([
  "skills",
  "languages",
  "certifications",
  "courses",
  "references",
]);

export function splitTwoColumnSections(sectionOrder: string[]) {
  return sectionOrder.reduce<{ sidebar: string[]; main: string[] }>(
    (columns, sectionId) => {
      columns[TWO_COLUMN_SIDEBAR_SECTIONS.has(sectionId) ? "sidebar" : "main"].push(sectionId);
      return columns;
    },
    { sidebar: [], main: [] },
  );
}
