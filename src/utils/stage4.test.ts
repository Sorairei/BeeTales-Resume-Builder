import { describe, expect, it } from "vitest";
import { defaultResume } from "../data/defaultResume";
import { readBackupFile } from "../services/backupService";
import { contrastRatio, hasSafeAccentContrast } from "./contrast";
import { resumeBackupFileName } from "./fileNames";
import { migrateResumeData } from "./migrations";
import { isValidEmail, isValidPhone, isValidWebAddress } from "./validation";

describe("Stage 4 data safeguards", () => {
  it("migrates an older resume and restores missing visual defaults", () => {
    const legacy = structuredClone(defaultResume) as unknown as Record<string, unknown>;
    legacy.version = 3;
    const settings = legacy.settings as Record<string, unknown>;
    delete settings.photoZoom; delete settings.photoPositionX; delete settings.photoPositionY;
    const migrated = migrateResumeData(legacy);
    expect(migrated.version).toBe(4);
    expect(migrated.settings.photoZoom).toBe(1);
    expect(migrated.settings.photoPositionX).toBe(50);
  });

  it("rejects unsupported future data versions", () => {
    expect(() => migrateResumeData({ ...defaultResume, version: 99 })).toThrow("incompatible-version");
  });

  it("validates contact information without requiring URL schemes", () => {
    expect(isValidEmail("person@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidPhone("+52 55 1234 5678")).toBe(true);
    expect(isValidPhone("12")).toBe(false);
    expect(isValidWebAddress("portfolio.example.com/profile")).toBe(true);
    expect(isValidWebAddress("not a url")).toBe(false);
  });

  it("creates safe and predictable backup file names", () => {
    expect(resumeBackupFileName("María López", new Date("2026-07-15T12:00:00Z"))).toBe("beetales-resume-maria-lopez-2026-07-15.json");
  });

  it("detects safe and unsafe accent contrast", () => {
    expect(contrastRatio("#111111")).toBeGreaterThan(10);
    expect(hasSafeAccentContrast("#111111")).toBe(true);
    expect(hasSafeAccentContrast("#FFFFAA")).toBe(false);
  });

  it("imports a valid portable backup", async () => {
    const content = JSON.stringify({ format: "beetales-resume-builder", backupVersion: 1, exportedAt: "2026-07-15T12:00:00.000Z", resume: defaultResume });
    const imported = await readBackupFile(new File([content], "resume.json", { type: "application/json" }));
    expect(imported.resume.personal.fullName).toBe(defaultResume.personal.fullName);
    expect(imported.resume.settings.template).toBe(defaultResume.settings.template);
  });

  it("rejects malformed JSON without executing it", async () => {
    await expect(readBackupFile(new File(["{not-json"], "broken.json", { type: "application/json" }))).rejects.toThrow("invalid-json");
  });
});
