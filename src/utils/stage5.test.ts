import { describe, expect, it } from "vitest";
import { defaultResume } from "../data/defaultResume";
import { emptyResume } from "../data/emptyResume";
import { analyzeResume } from "./atsAnalyzer";
import { resumePdfFileName } from "./fileNames";

describe("Stage 5 ATS review and PDF naming", () => {
  it("scores an empty resume lower and reports missing essentials", () => {
    const analysis = analyzeResume(structuredClone(emptyResume), 1);
    expect(analysis.score).toBeLessThan(60);
    expect(analysis.observations.some((item) => item.key === "atsEmailMissing" && item.severity === "warning")).toBe(true);
    expect(analysis.observations.some((item) => item.key === "atsExperienceMissing")).toBe(true);
  });

  it("reports layout, photo, contrast, and length risks", () => {
    const resume = structuredClone(defaultResume);
    resume.personal.photo = "indexeddb:resume-photo:test";
    resume.settings.showPhoto = true;
    resume.settings.template = "two-column";
    resume.settings.accentColor = "#FFFFAA";
    const analysis = analyzeResume(resume, 3);
    const keys = analysis.observations.map((item) => item.key);
    expect(keys).toContain("atsPhotoUsed");
    expect(keys).toContain("atsTwoColumnsUsed");
    expect(keys).toContain("atsLowContrast");
    expect(keys).toContain("atsTooManyPages");
  });

  it("creates a safe PDF file name from the candidate name", () => {
    expect(resumePdfFileName("José da Silva")).toBe("resume-jose-da-silva.pdf");
  });
});
