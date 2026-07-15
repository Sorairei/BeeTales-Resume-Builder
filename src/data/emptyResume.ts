import type { ResumeData } from "../types/resume";

export const emptyResume: ResumeData = {
  version: 4,
  language: "en",
  settings: {
    template: "ats-classic",
    accentColor: "#374151",
    fontFamily: "arial",
    fontSize: "medium",
    density: "normal",
    dividerStyle: "thin",
    showPhoto: false,
    photoShape: "circle",
    photoSize: "medium",
    photoZoom: 1,
    photoPositionX: 50,
    photoPositionY: 50,
    pageSize: "a4",
    margins: "normal",
  },
  personal: {
    fullName: "", professionalTitle: "", email: "", phone: "", city: "", region: "", country: "",
    address: "", linkedin: "", github: "", website: "", portfolio: "", photo: "",
  },
  summary: "",
  experience: [], education: [], skills: [], languages: [], certifications: [], projects: [], courses: [], references: [], referenceMode: "full", customSections: [],
  sectionOrder: ["summary", "experience", "education", "skills", "languages", "certifications", "projects", "courses", "references"],
  hiddenSections: [],
};
