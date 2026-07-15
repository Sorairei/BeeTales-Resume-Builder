import { parse, stringify } from "yaml";
import type { ResumeData } from "../types/resume";
import { migrateResumeData } from "../utils/migrations";

export type TextResumeFormat = "yaml" | "markdown";

const MAX_TEXT_FILE_SIZE = 2 * 1024 * 1024;

function portableResume(resume: ResumeData): ResumeData {
  return { ...structuredClone(resume), personal: { ...resume.personal, photo: "" } };
}

function yamlDocument(resume: ResumeData): string {
  return stringify(portableResume(resume), { indent: 2, lineWidth: 0 });
}

function readableMarkdown(resume: ResumeData): string {
  const lines: string[] = [];
  const contact = [resume.personal.email, resume.personal.phone, resume.personal.city, resume.personal.country].filter(Boolean).join(" · ");
  lines.push(`# ${resume.personal.fullName || "Resume"}`);
  if (resume.personal.professionalTitle) lines.push("", `**${resume.personal.professionalTitle}**`);
  if (contact) lines.push("", contact);
  if (resume.summary) lines.push("", "## Professional summary", "", resume.summary);
  if (resume.experience.length) {
    lines.push("", "## Work experience");
    for (const item of resume.experience) {
      const dates = [item.startDate, item.current ? "Present" : item.endDate].filter(Boolean).join(" — ");
      lines.push("", `### ${item.position || "Position"}${item.company ? ` · ${item.company}` : ""}`, dates ? `*${dates}*` : "");
      if (item.description) lines.push("", item.description);
      for (const achievement of item.achievements.filter(Boolean)) lines.push(`- ${achievement}`);
    }
  }
  if (resume.education.length) {
    lines.push("", "## Education");
    for (const item of resume.education) lines.push("", `### ${item.degree || "Qualification"}`, [item.institution, item.startDate, item.endDate].filter(Boolean).join(" · "));
  }
  if (resume.skills.length) lines.push("", "## Skills", "", resume.skills.map((item) => item.name).filter(Boolean).join(" · "));
  if (resume.languages.length) lines.push("", "## Languages", "", resume.languages.map((item) => `${item.name}${item.level ? ` — ${item.level}` : ""}`).join(" · "));
  if (resume.projects.length) {
    lines.push("", "## Projects");
    for (const item of resume.projects) lines.push("", `### ${item.name || "Project"}`, item.description);
  }
  return lines.filter((line, index) => line !== "" || lines[index - 1] !== "").join("\n").trim();
}

export function serializeTextResume(resume: ResumeData, format: TextResumeFormat): string {
  const yaml = yamlDocument(resume);
  if (format === "yaml") return `# BeeTales Resume Builder — editable structured resume\n${yaml}`;
  return `---\n${yaml}---\n\n<!-- Edit the YAML front matter above. The readable section below is regenerated after synchronization. -->\n\n${readableMarkdown(resume)}\n`;
}

function yamlSource(text: string, format: TextResumeFormat): string {
  if (format === "yaml") return text;
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s*\r?\n|$)/);
  if (!match) throw new Error("invalid-text");
  return match[1];
}

export function parseTextResume(text: string, format: TextResumeFormat, current: ResumeData): ResumeData {
  try {
    const value = parse(yamlSource(text, format));
    const migrated = migrateResumeData(value);
    const hasLocalPhoto = Boolean(current.personal.photo);
    return {
      ...migrated,
      personal: { ...migrated.personal, photo: current.personal.photo },
      settings: { ...migrated.settings, showPhoto: hasLocalPhoto ? migrated.settings.showPhoto : false },
    };
  } catch (error) {
    if (error instanceof Error && error.message === "invalid-text") throw error;
    throw new Error("invalid-text", { cause: error });
  }
}

export async function readTextResumeFile(file: File): Promise<string> {
  if (file.size > MAX_TEXT_FILE_SIZE) throw new Error("text-file-too-large");
  return file.text();
}

export function downloadTextResume(content: string, format: TextResumeFormat, fullName: string): void {
  const safeName = fullName.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "resume";
  const extension = format === "yaml" ? "yaml" : "md";
  const blob = new Blob([content], { type: format === "yaml" ? "application/yaml" : "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeName}.${extension}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
