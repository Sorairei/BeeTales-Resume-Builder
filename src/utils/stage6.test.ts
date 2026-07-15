import { describe, expect, it } from "vitest";
import { defaultResume } from "../data/defaultResume";
import { palettes } from "../data/palettes";
import { resumeTemplates } from "../data/resumeTemplates";
import { translations } from "../data/translations";
import { moveItem } from "./arrays";
import { migrateResumeData } from "./migrations";
import { normalizeHiddenSections, normalizeSectionOrder } from "./sectionOrder";
import { splitTwoColumnSections, usesSidebarLayout } from "./templateLayout";

describe("Stage 6 interface and ordering safeguards", () => {
  it("exposes eight distinct template choices", () => {
    const ids = resumeTemplates.map((template) => template.id);
    expect(ids).toEqual(["ats-classic", "modern", "executive", "two-column", "swiss-grid", "tech-compact", "timeline", "studio"]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps palette colors and identifiers unique", () => {
    expect(new Set(palettes.map((palette) => palette.id)).size).toBe(palettes.length);
    expect(new Set(palettes.map((palette) => palette.color.toLowerCase())).size).toBe(palettes.length);
  });

  it("provides every non-empty interface label in all supported languages", () => {
    const englishKeys = Object.keys(translations.en).sort();
    for (const dictionary of Object.values(translations)) {
      expect(Object.keys(dictionary).sort()).toEqual(englishKeys);
      expect(Object.values(dictionary).every((value) => value.trim().length > 0)).toBe(true);
    }
  });

  it("removes duplicate and unknown section positions while appending missing sections", () => {
    const order = normalizeSectionOrder(["skills", "skills", "unknown", "summary"], ["custom-a"]);
    expect(order.slice(0, 2)).toEqual(["skills", "summary"]);
    expect(order).toContain("custom-a");
    expect(new Set(order).size).toBe(order.length);
    expect(normalizeHiddenSections(["summary", "summary", "unknown"], order)).toEqual(["summary"]);
  });

  it("repairs invalid ordering when loading saved or imported data", () => {
    const resume = structuredClone(defaultResume);
    resume.sectionOrder = ["experience", "experience", "missing", "summary"];
    resume.hiddenSections = ["summary", "summary", "missing"];
    const migrated = migrateResumeData(resume);
    expect(migrated.sectionOrder.filter((id) => id === "experience")).toHaveLength(1);
    expect(migrated.hiddenSections).toEqual(["summary"]);
  });

  it("moves collection items without mutating or losing their numbering order", () => {
    const original = ["one", "two", "three"];
    expect(moveItem(original, 2, -1)).toEqual(["one", "three", "two"]);
    expect(original).toEqual(["one", "two", "three"]);
  });

  it("places two-column sidebar and main sections in independent ordered columns", () => {
    const columns = splitTwoColumnSections(["summary", "experience", "skills", "education", "languages", "projects"]);
    expect(columns.sidebar).toEqual(["skills", "languages"]);
    expect(columns.main).toEqual(["summary", "experience", "education", "projects"]);
  });

  it("only assigns the independent sidebar layout to compatible templates", () => {
    expect(usesSidebarLayout("two-column")).toBe(true);
    expect(usesSidebarLayout("studio")).toBe(true);
    expect(usesSidebarLayout("swiss-grid")).toBe(false);
    expect(usesSidebarLayout("tech-compact")).toBe(false);
    expect(usesSidebarLayout("timeline")).toBe(false);
  });
});
