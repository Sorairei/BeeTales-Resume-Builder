import { describe, expect, it } from "vitest";
import { defaultResume } from "../data/defaultResume";
import { textResumeFileName } from "../utils/fileNames";
import { parseTextResume, serializeTextResume } from "./textModeService";

describe("text resume synchronization", () => {
  it("round-trips the complete resume through YAML", () => {
    const source = structuredClone(defaultResume);
    const text = serializeTextResume(source, "yaml");
    const parsed = parseTextResume(text, "yaml", source);
    expect(parsed.personal.fullName).toBe(source.personal.fullName);
    expect(parsed.experience).toEqual(source.experience);
    expect(parsed.settings.template).toBe(source.settings.template);
  });

  it("uses YAML front matter as the structured source in Markdown", () => {
    const source = structuredClone(defaultResume);
    const text = serializeTextResume(source, "markdown");
    expect(text).toContain("# Valeria Mendoza");
    const updated = text.replace("fullName: Valeria Mendoza", "fullName: Automation Candidate");
    expect(parseTextResume(updated, "markdown", source).personal.fullName).toBe("Automation Candidate");
  });

  it("preserves the locally stored photo reference", () => {
    const current = structuredClone(defaultResume);
    current.personal.photo = "indexeddb:resume-photo:test";
    current.settings.showPhoto = true;
    const text = serializeTextResume(current, "yaml");
    expect(text).not.toContain("indexeddb:resume-photo:test");
    const parsed = parseTextResume(text, "yaml", current);
    expect(parsed.personal.photo).toBe("indexeddb:resume-photo:test");
    expect(parsed.settings.showPhoto).toBe(true);
  });

  it("rejects invalid or incomplete structured text", () => {
    expect(() => parseTextResume("personal: [", "yaml", defaultResume)).toThrow("invalid-text");
    expect(() => parseTextResume("# Missing front matter", "markdown", defaultResume)).toThrow("invalid-text");
  });

  it("creates portable text export file names", () => {
    expect(textResumeFileName("María López", "yaml")).toBe("maria-lopez.yaml");
    expect(textResumeFileName("", "md")).toBe("resume.md");
  });
});
