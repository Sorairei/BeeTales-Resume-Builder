import type { ResumeData } from "../types/resume";
import { emptyResume } from "./emptyResume";

export const defaultResume: ResumeData = {
  ...structuredClone(emptyResume),
  personal: {
    ...emptyResume.personal,
    fullName: "Valeria Mendoza",
    professionalTitle: "Digital Product Manager",
    email: "valeria.mendoza@email.com",
    phone: "+52 55 1234 5678",
    city: "Mexico City",
    country: "Mexico",
    linkedin: "linkedin.com/in/valeriamendoza",
    portfolio: "valeriamendoza.dev",
  },
  summary: "Product professional with more than seven years of experience turning business needs into simple, measurable digital products. Specialized in strategy, user research, and cross-functional team leadership.",
  experience: [
    {
      id: "exp-demo-1", company: "Nebula Technology", position: "Product Manager", location: "Mexico City", workMode: "hybrid",
      startDate: "2022-03", endDate: "", current: true,
      description: "I lead the strategy and evolution of a B2B platform used by more than 18,000 professionals.",
      achievements: ["Increased new-user activation by 28% through an onboarding redesign.", "Coordinated a 12-person team across design, engineering, data, and operations."],
    },
    {
      id: "exp-demo-2", company: "Estudio Norte", position: "Product Owner", location: "Monterrey, NL", workMode: "remote",
      startDate: "2019-01", endDate: "2022-02", current: false,
      description: "Managed the complete lifecycle of web products for financial services and education clients.",
      achievements: ["Reduced delivery time by 35% by establishing discovery and prioritization processes.", "Launched five digital products within the agreed budget."],
    },
  ],
  education: [{ id: "edu-demo-1", institution: "Tecnológico de Monterrey", degree: "Bachelor's Degree in Marketing", field: "Innovation", location: "Monterrey", startDate: "2013", endDate: "2017", status: "Completed", description: "" }],
  skills: [
    { id: "skill-1", name: "Product strategy", category: "Product", level: "Advanced" },
    { id: "skill-2", name: "User research", category: "Product", level: "Advanced" },
    { id: "skill-3", name: "Agile / Scrum", category: "Methodologies", level: "Advanced" },
  ],
  languages: [{ id: "lang-1", name: "Spanish", level: "Native", certification: "", score: "" }, { id: "lang-2", name: "English", level: "C1", certification: "", score: "" }],
  certifications: [{ id: "cert-1", name: "Professional Scrum Product Owner", issuer: "Scrum.org", issueDate: "2021", expirationDate: "", credentialId: "", url: "" }],
  projects: [{ id: "project-1", name: "B2B self-service portal", description: "Platform for managing teams, billing, and support without manual intervention.", technologies: ["Figma", "Amplitude", "Jira"], url: "", repository: "", date: "2024", achievements: [] }],
};
