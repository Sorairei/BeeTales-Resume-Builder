import type { TranslationKey } from "../data/translations";
import type { ResumeData } from "../types/resume";
import { hasSafeAccentContrast } from "./contrast";
import { isValidEmail, isValidWebAddress } from "./validation";

export type AtsSeverity = "correct" | "recommendation" | "warning";
export interface AtsObservation { key: TranslationKey; severity: AtsSeverity; deduction: number; }
export interface AtsAnalysis { score: number; observations: AtsObservation[]; counts: Record<AtsSeverity, number>; }

function observation(key: TranslationKey, severity: AtsSeverity, deduction = 0): AtsObservation { return { key, severity, deduction }; }

function allLinks(resume: ResumeData): string[] {
  return [resume.personal.linkedin, resume.personal.github, resume.personal.website, resume.personal.portfolio,
    ...resume.certifications.map((item) => item.url), ...resume.projects.flatMap((item) => [item.url, item.repository]),
    ...resume.courses.map((item) => item.url), ...resume.customSections.flatMap((section) => section.items.map((item) => item.url))].filter(Boolean);
}

export function analyzeResume(resume: ResumeData, pageCount = 1): AtsAnalysis {
  const results: AtsObservation[] = [];
  const location = [resume.personal.city, resume.personal.region, resume.personal.country].filter(Boolean);
  const wordCount = resume.summary.trim() ? resume.summary.trim().split(/\s+/).length : 0;

  results.push(resume.personal.email && isValidEmail(resume.personal.email) ? observation("atsEmailGood", "correct") : observation("atsEmailMissing", "warning", 10));
  results.push(resume.personal.phone ? observation("atsPhoneGood", "correct") : observation("atsPhoneMissing", "recommendation", 4));
  results.push(location.length > 0 ? observation("atsLocationGood", "correct") : observation("atsLocationMissing", "warning", 8));
  if (!resume.summary.trim()) results.push(observation("atsSummaryMissing", "warning", 12));
  else if (wordCount < 35) results.push(observation("atsSummaryShort", "recommendation", 5));
  else if (wordCount > 120) results.push(observation("atsSummaryLong", "warning", 7));
  else results.push(observation("atsSummaryGood", "correct"));

  if (resume.experience.length === 0) results.push(observation("atsExperienceMissing", "warning", 12));
  else {
    results.push(resume.experience.some((item) => !item.startDate || (!item.current && !item.endDate)) ? observation("atsExperienceDates", "warning", 8) : observation("atsExperienceDatesGood", "correct"));
    results.push(resume.experience.some((item) => !item.description.trim()) ? observation("atsExperienceDescription", "recommendation", 5) : observation("atsExperienceDescriptionGood", "correct"));
    results.push(resume.experience.some((item) => !item.achievements.some((value) => value.trim())) ? observation("atsAchievementsMissing", "recommendation", 5) : observation("atsAchievementsGood", "correct"));
    if (resume.experience.some((item) => !item.company.trim() || !item.position.trim())) results.push(observation("atsIncompleteFields", "warning", 7));
  }

  results.push(resume.education.length ? observation("atsEducationGood", "correct") : observation("atsEducationMissing", "recommendation", 5));
  results.push(resume.skills.some((item) => item.name.trim()) ? observation("atsSkillsGood", "correct") : observation("atsSkillsMissing", "warning", 8));
  const linksValid = allLinks(resume).every(isValidWebAddress) && isValidEmail(resume.personal.email);
  results.push(linksValid ? observation("atsLinksGood", "correct") : observation("atsLinksInvalid", "warning", 6));
  if (resume.customSections.some((section) => !section.hidden && !section.title.trim())) results.push(observation("atsHeadingsUnclear", "recommendation", 4));

  if (pageCount > 2) results.push(observation("atsTooManyPages", "warning", 10));
  else results.push(observation(pageCount === 2 ? "atsTwoPages" : "atsOnePage", "correct"));
  if (resume.settings.showPhoto && resume.personal.photo) results.push(observation("atsPhotoUsed", "recommendation", 3));
  if (["two-column", "studio"].includes(resume.settings.template)) results.push(observation("atsTwoColumnsUsed", "recommendation", 6));
  else if (resume.settings.template === "ats-classic") results.push(observation("atsTemplateGood", "correct"));
  if (!hasSafeAccentContrast(resume.settings.accentColor)) results.push(observation("atsLowContrast", "warning", 7));

  const essentialHidden = ["summary", "experience", "education", "skills"].some((section) => resume.hiddenSections.includes(section));
  if (essentialHidden) results.push(observation("atsEssentialHidden", "warning", 10));

  const deduction = results.reduce((total, item) => total + item.deduction, 0);
  const counts = results.reduce<Record<AtsSeverity, number>>((totals, item) => ({ ...totals, [item.severity]: totals[item.severity] + 1 }), { correct: 0, recommendation: 0, warning: 0 });
  return { score: Math.max(0, 100 - deduction), observations: results, counts };
}
