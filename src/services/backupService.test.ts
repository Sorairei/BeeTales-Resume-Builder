import { describe, expect, it } from "vitest";
import { defaultResume } from "../data/defaultResume";
import { createBackupJson, readBackupFile } from "./backupService";

function backupFile(overrides: Record<string, unknown> = {}): File {
  const content = JSON.stringify({
    format: "beetales-resume-builder",
    backupVersion: 1,
    exportedAt: "2026-07-17T12:00:00.000Z",
    resume: defaultResume,
    ...overrides,
  });
  return new File([content], "resume.json", { type: "application/json" });
}

describe("portable JSON backups", () => {
  it("exports a versioned envelope without adding an absent photo", async () => {
    const { content, fileName } = await createBackupJson(defaultResume, null);
    const parsed = JSON.parse(content) as Record<string, unknown>;

    expect(parsed.format).toBe("beetales-resume-builder");
    expect(parsed.backupVersion).toBe(1);
    expect(parsed.exportedAt).toEqual(expect.any(String));
    expect(parsed.resume).toEqual(defaultResume);
    expect(parsed).not.toHaveProperty("photo");
    expect(fileName).toMatch(/^beetales-resume-valeria-mendoza-\d{4}-\d{2}-\d{2}\.json$/);
  });

  it("restores a validated embedded image", async () => {
    const photo = `data:image/png;base64,${btoa("bee")}`;
    const imported = await readBackupFile(backupFile({ photo }));

    expect(imported.photo?.type).toBe("image/png");
    expect(await imported.photo?.text()).toBe("bee");
  });

  it("rejects unsupported backup-envelope versions explicitly", async () => {
    await expect(readBackupFile(backupFile({ backupVersion: 2 }))).rejects.toThrow("incompatible-version");
  });

  it("rejects malformed known envelopes instead of treating them as legacy resumes", async () => {
    await expect(readBackupFile(backupFile({ resume: null }))).rejects.toThrow("invalid-structure");
    await expect(readBackupFile(backupFile({ photo: "data:text/plain;base64,YmVl" }))).rejects.toThrow("invalid-structure");
  });

  it("rejects files above the import limit before reading their contents", async () => {
    let read = false;
    const oversizedFile = {
      size: 8 * 1024 * 1024 + 1,
      text: async () => { read = true; return "{}"; },
    } as File;

    await expect(readBackupFile(oversizedFile)).rejects.toThrow("file-too-large");
    expect(read).toBe(false);
  });
});
