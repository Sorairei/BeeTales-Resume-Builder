import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslator } from "../../data/translations";
import type { ResumeData } from "../../types/resume";
import { formatDate } from "../../utils/dates";

interface Props { resume: ResumeData; }

function cleanUrl(value: string): string { return value.replace(/^https?:\/\//, "").replace(/\/$/, ""); }
function linkHref(value: string): string { return /^https?:\/\//.test(value) ? value : `https://${value}`; }
function groupedSkills(skills: ResumeData["skills"], defaultCategory: string): Record<string, ResumeData["skills"]> {
  return skills.reduce<Record<string, ResumeData["skills"]>>((groups, skill) => {
    const category = skill.category || defaultCategory;
    groups[category] = [...(groups[category] ?? []), skill];
    return groups;
  }, {});
}

export function AtsClassicTemplate({ resume }: Props) {
  const { personal } = resume;
  const t = getTranslator(resume.language);
  const location = [personal.city, personal.region, personal.country].filter(Boolean).join(", ");
  const links = [personal.linkedin, personal.github, personal.website, personal.portfolio].filter(Boolean);

  return (
    <article className="resume-page ats-template" aria-label={t("resumePreviewAria")}>
      <header className="resume-header">
        <h2>{personal.fullName || t("yourName")}</h2>
        <p className="resume-title">{personal.professionalTitle || t("professionalTitleFallback")}</p>
        <div className="contact-row">
          {personal.email && <a href={`mailto:${personal.email}`}><Mail size={11} />{personal.email}</a>}
          {personal.phone && <a href={`tel:${personal.phone}`}><Phone size={11} />{personal.phone}</a>}
          {location && <span><MapPin size={11} />{location}</span>}
        </div>
        {links.length > 0 && <div className="link-row">{links.map((link) => <a href={linkHref(link)} key={link}>{cleanUrl(link)}</a>)}</div>}
      </header>

      {resume.summary && <ResumeSection title={t("summary")}><p className="summary-copy">{resume.summary}</p></ResumeSection>}

      {resume.experience.length > 0 && <ResumeSection title={t("experience")}>
        <div className="resume-list">{resume.experience.map((item) => <section className="resume-item" key={item.id}>
          <div className="resume-item-heading"><div><h4>{item.position || t("position")}</h4><p>{item.company || t("company")}{item.location ? ` · ${item.location}` : ""}{item.workMode === "remote" ? ` · ${t("remote")}` : item.workMode === "hybrid" ? ` · ${t("hybrid")}` : ""}</p></div><time>{formatDate(item.startDate, resume.language)}{item.startDate && " — "}{item.current ? t("present") : formatDate(item.endDate, resume.language)}</time></div>
          {item.description && <p className="item-description">{item.description}</p>}
          {item.achievements.some(Boolean) && <ul>{item.achievements.filter(Boolean).map((achievement, index) => <li key={index}>{achievement}</li>)}</ul>}
        </section>)}</div>
      </ResumeSection>}

      {resume.education.length > 0 && <ResumeSection title={t("education")}><div className="resume-list">{resume.education.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.degree}</h4><p>{item.institution}{item.field ? ` · ${item.field}` : ""}</p></div><time>{formatDate(item.startDate, resume.language)}{item.startDate && item.endDate ? " — " : ""}{formatDate(item.endDate, resume.language)}</time></div></section>)}</div></ResumeSection>}

      {resume.skills.length > 0 && <ResumeSection title={t("skills")}><div className="text-groups">{Object.entries(groupedSkills(resume.skills, t("skills"))).map(([category, skills]) => <p key={category}><strong>{category}:</strong> {skills.map((skill) => skill.name).join(", ")}</p>)}</div></ResumeSection>}

      {(resume.languages.length > 0 || resume.certifications.length > 0) && <div className="resume-columns">
        {resume.languages.length > 0 && <ResumeSection title={t("languages")}><div className="text-groups">{resume.languages.map((item) => <p key={item.id}><strong>{item.name}</strong> — {item.level}</p>)}</div></ResumeSection>}
        {resume.certifications.length > 0 && <ResumeSection title={t("certifications")}><div className="text-groups">{resume.certifications.map((item) => <p key={item.id}><strong>{item.name}</strong><br />{item.issuer}{item.issueDate ? ` · ${formatDate(item.issueDate, resume.language)}` : ""}</p>)}</div></ResumeSection>}
      </div>}

      {resume.projects.length > 0 && <ResumeSection title={t("projects")}><div className="resume-list">{resume.projects.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.name}</h4>{item.technologies.length > 0 && <p>{item.technologies.join(" · ")}</p>}</div><time>{item.date}</time></div><p className="item-description">{item.description}</p></section>)}</div></ResumeSection>}
    </article>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="resume-section"><h3>{title}</h3>{children}</section>;
}
