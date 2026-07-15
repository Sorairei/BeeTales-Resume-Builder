import type { TranslationKey } from "./translations";
import type { ResumeTemplate } from "../types/resume";

export const resumeTemplates: Array<{
  id: ResumeTemplate;
  name: TranslationKey;
  description: TranslationKey;
  ats: TranslationKey;
  photo: boolean;
}> = [
  { id: "ats-classic", name: "atsClassic", description: "atsTemplateDescription", ats: "atsHigh", photo: false },
  { id: "modern", name: "modernTemplate", description: "modernTemplateDescription", ats: "atsMediumHigh", photo: true },
  { id: "executive", name: "executiveTemplate", description: "executiveTemplateDescription", ats: "atsMediumHigh", photo: true },
  { id: "two-column", name: "twoColumnTemplate", description: "twoColumnTemplateDescription", ats: "atsMedium", photo: true },
];
