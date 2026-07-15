export type AppLanguage = "en" | "es" | "pl" | "pt";
export type ResumeTemplate = "ats-classic" | "modern" | "executive" | "two-column" | "swiss-grid" | "tech-compact" | "timeline" | "studio";

export interface ResumeSettings {
  template: ResumeTemplate;
  accentColor: string;
  fontFamily: "inter" | "arial" | "helvetica" | "source-sans" | "georgia" | "merriweather";
  fontSize: "small" | "medium" | "large";
  density: "compact" | "normal" | "spacious";
  dividerStyle: "solid" | "thin" | "none";
  showPhoto: boolean;
  photoShape: "circle" | "rectangle";
  photoSize: "small" | "medium" | "large";
  photoZoom: number;
  photoPositionX: number;
  photoPositionY: number;
  pageSize: "a4" | "letter";
  margins: "narrow" | "normal" | "wide";
}

export interface PersonalInformation {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  country: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
  portfolio: string;
  photo: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  workMode: "onsite" | "hybrid" | "remote";
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface EducationItem { id: string; institution: string; degree: string; field: string; location: string; startDate: string; endDate: string; status: string; description: string; }
export interface SkillItem { id: string; name: string; category: string; level: string; }
export interface LanguageItem { id: string; name: string; level: string; certification: string; score: string; }
export interface CertificationItem { id: string; name: string; issuer: string; issueDate: string; expirationDate: string; credentialId: string; url: string; }
export interface ProjectItem { id: string; name: string; description: string; technologies: string[]; url: string; repository: string; date: string; achievements: string[]; }
export interface CourseItem { id: string; name: string; institution: string; date: string; duration: string; description: string; url: string; }
export interface ReferenceItem { id: string; name: string; position: string; company: string; relationship: string; phone: string; email: string; }
export interface CustomSectionItem { id: string; title: string; description: string; startDate: string; endDate: string; url: string; }
export interface CustomSection { id: string; title: string; description: string; items: CustomSectionItem[]; hidden: boolean; }
export interface SectionConfiguration { id: string; label: string; hidden: boolean; order: number; }

export interface ResumeData {
  version: number;
  language: AppLanguage;
  settings: ResumeSettings;
  personal: PersonalInformation;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  certifications: CertificationItem[];
  projects: ProjectItem[];
  courses: CourseItem[];
  references: ReferenceItem[];
  referenceMode: "full" | "on-request";
  customSections: CustomSection[];
  sectionOrder: string[];
  hiddenSections: string[];
}

export type SaveStatus = "saved" | "saving" | "error";
