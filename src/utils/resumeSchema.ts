import { z } from "zod";

const text = (maximum = 500) => z.string().max(maximum);
const id = text(120).min(1);

export const resumeSchema = z.object({
  version: z.number().int().min(1).max(4),
  language: z.enum(["en", "es", "pl", "pt"]),
  settings: z.object({
    template: z.enum(["ats-classic", "modern", "executive", "two-column"]),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    fontFamily: z.enum(["inter", "arial", "helvetica", "source-sans", "georgia", "merriweather"]),
    fontSize: z.enum(["small", "medium", "large"]),
    density: z.enum(["compact", "normal", "spacious"]),
    dividerStyle: z.enum(["solid", "thin", "none"]),
    showPhoto: z.boolean(), photoShape: z.enum(["circle", "rectangle"]),
    photoZoom: z.number().min(1).max(2), photoPositionX: z.number().min(0).max(100), photoPositionY: z.number().min(0).max(100),
    pageSize: z.enum(["a4", "letter"]), margins: z.enum(["narrow", "normal", "wide"]),
  }),
  personal: z.object({
    fullName: text(180), professionalTitle: text(100), email: text(254), phone: text(80), city: text(120), region: text(120), country: text(120), address: text(220),
    linkedin: text(500), github: text(500), website: text(500), portfolio: text(500), photo: text(180),
  }),
  summary: text(900),
  experience: z.array(z.object({ id, company: text(180), position: text(180), location: text(180), workMode: z.enum(["onsite", "hybrid", "remote"]), startDate: text(30), endDate: text(30), current: z.boolean(), description: text(3000), achievements: z.array(text(800)).max(50) })).max(100),
  education: z.array(z.object({ id, institution: text(180), degree: text(180), field: text(180), location: text(180), startDate: text(30), endDate: text(30), status: text(120), description: text(2000) })).max(100),
  skills: z.array(z.object({ id, name: text(180), category: text(180), level: text(120) })).max(300),
  languages: z.array(z.object({ id, name: text(120), level: text(120), certification: text(180), score: text(120) })).max(100),
  certifications: z.array(z.object({ id, name: text(180), issuer: text(180), issueDate: text(30), expirationDate: text(30), credentialId: text(180), url: text(500) })).max(100),
  projects: z.array(z.object({ id, name: text(180), description: text(3000), technologies: z.array(text(180)).max(100), url: text(500), repository: text(500), date: text(60), achievements: z.array(text(800)).max(50) })).max(100),
  courses: z.array(z.object({ id, name: text(180), institution: text(180), date: text(60), duration: text(120), description: text(2000), url: text(500) })).max(100),
  references: z.array(z.object({ id, name: text(180), position: text(180), company: text(180), relationship: text(180), phone: text(80), email: text(254) })).max(100),
  referenceMode: z.enum(["full", "on-request"]),
  customSections: z.array(z.object({ id, title: text(180), description: text(2000), hidden: z.boolean(), items: z.array(z.object({ id, title: text(180), description: text(3000), startDate: text(60), endDate: text(60), url: text(500) })).max(100) })).max(50),
  sectionOrder: z.array(text(180)).max(100), hiddenSections: z.array(text(180)).max(100),
});

export type ValidatedResume = z.infer<typeof resumeSchema>;
