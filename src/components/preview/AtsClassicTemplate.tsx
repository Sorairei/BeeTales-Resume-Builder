import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslator } from "../../data/translations";
import type { ResumeData } from "../../types/resume";
import { formatDate } from "../../utils/dates";
import { splitTwoColumnSections } from "../../utils/templateLayout";

interface Props { resume: ResumeData; photoUrl?: string; }

function cleanUrl(value: string): string { return value.replace(/^https?:\/\//, "").replace(/\/$/, ""); }
function linkHref(value: string): string { return /^https?:\/\//.test(value) ? value : `https://${value}`; }
function groupedSkills(skills: ResumeData["skills"], defaultCategory: string): Record<string, ResumeData["skills"]> {
  return skills.reduce<Record<string, ResumeData["skills"]>>((groups, skill) => {
    const category = skill.category || defaultCategory;
    groups[category] = [...(groups[category] ?? []), skill];
    return groups;
  }, {});
}

export function AtsClassicTemplate({ resume, photoUrl }: Props) {
  const { personal } = resume;
  const t = getTranslator(resume.language);
  const location = [personal.city, personal.region, personal.country].filter(Boolean).join(", ");
  const links = [personal.linkedin, personal.github, personal.website, personal.portfolio].filter(Boolean);
  const renderSection = (id: string): React.ReactNode => {
    if (resume.hiddenSections.includes(id)) return null;

    if (id === "summary") return resume.summary ? <ResumeSection title={t("summary")}><p className="summary-copy">{resume.summary}</p></ResumeSection> : null;

    if (id === "experience") return resume.experience.length > 0 ? <ResumeSection title={t("experience")}>
      <div className="resume-list">{resume.experience.map((item) => <section className="resume-item" key={item.id}>
        <div className="resume-item-heading"><div><h4>{item.position || t("position")}</h4><p>{item.company || t("company")}{item.location ? ` · ${item.location}` : ""}{item.workMode === "remote" ? ` · ${t("remote")}` : item.workMode === "hybrid" ? ` · ${t("hybrid")}` : ""}</p></div><time>{formatDate(item.startDate, resume.language)}{item.startDate && " — "}{item.current ? t("present") : formatDate(item.endDate, resume.language)}</time></div>
        {item.description && <p className="item-description">{item.description}</p>}
        {item.achievements.some(Boolean) && <ul>{item.achievements.filter(Boolean).map((achievement, index) => <li key={index}>{achievement}</li>)}</ul>}
      </section>)}</div>
    </ResumeSection> : null;

    if (id === "education") return resume.education.length > 0 ? <ResumeSection title={t("education")}><div className="resume-list">{resume.education.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.degree}</h4><p>{item.institution}{item.field ? ` · ${item.field}` : ""}{item.location ? ` · ${item.location}` : ""}</p></div><time>{formatDate(item.startDate, resume.language)}{item.startDate && item.endDate ? " — " : ""}{formatDate(item.endDate, resume.language)}</time></div>{item.description && <p className="item-description">{item.description}</p>}</section>)}</div></ResumeSection> : null;

    if (id === "skills") return resume.skills.length > 0 ? <ResumeSection title={t("skills")}><div className="text-groups">{Object.entries(groupedSkills(resume.skills, t("skills"))).map(([category, skills]) => <p key={category}><strong>{category}:</strong> {skills.map((skill) => skill.name).filter(Boolean).join(", ")}</p>)}</div></ResumeSection> : null;

    if (id === "languages") return resume.languages.length > 0 ? <ResumeSection title={t("languages")}><div className="text-groups">{resume.languages.map((item) => <p key={item.id}><strong>{item.name}</strong>{item.level ? ` — ${item.level}` : ""}{item.certification ? ` · ${item.certification}` : ""}{item.score ? ` (${item.score})` : ""}</p>)}</div></ResumeSection> : null;

    if (id === "certifications") return resume.certifications.length > 0 ? <ResumeSection title={t("certifications")}><div className="resume-list">{resume.certifications.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.url ? <a href={linkHref(item.url)}>{item.name}</a> : item.name}</h4><p>{item.issuer}{item.credentialId ? ` · ${item.credentialId}` : ""}</p></div><time>{formatDate(item.issueDate, resume.language)}{item.issueDate && item.expirationDate ? " — " : ""}{formatDate(item.expirationDate, resume.language)}</time></div></section>)}</div></ResumeSection> : null;

    if (id === "projects") return resume.projects.length > 0 ? <ResumeSection title={t("projects")}><div className="resume-list">{resume.projects.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.url ? <a href={linkHref(item.url)}>{item.name}</a> : item.name}</h4>{item.technologies.length > 0 && <p>{item.technologies.join(" · ")}</p>}</div><time>{item.date}</time></div>{item.description && <p className="item-description">{item.description}</p>}{item.achievements.some(Boolean) && <ul>{item.achievements.filter(Boolean).map((achievement, index) => <li key={index}>{achievement}</li>)}</ul>}{item.repository && <p className="resume-link"><a href={linkHref(item.repository)}>{cleanUrl(item.repository)}</a></p>}</section>)}</div></ResumeSection> : null;

    if (id === "courses") return resume.courses.length > 0 ? <ResumeSection title={t("courses")}><div className="resume-list">{resume.courses.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.url ? <a href={linkHref(item.url)}>{item.name}</a> : item.name}</h4><p>{item.institution}{item.duration ? ` · ${item.duration}` : ""}</p></div><time>{item.date}</time></div>{item.description && <p className="item-description">{item.description}</p>}</section>)}</div></ResumeSection> : null;

    if (id === "references") {
      if (resume.referenceMode === "on-request") return <ResumeSection title={t("references")}><p className="summary-copy">{t("referencesOnRequest")}</p></ResumeSection>;
      return resume.references.length > 0 ? <ResumeSection title={t("references")}><div className="resume-list">{resume.references.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.name}</h4><p>{[item.position, item.company, item.relationship].filter(Boolean).join(" · ")}</p></div></div><p className="reference-contact">{[item.email, item.phone].filter(Boolean).join(" · ")}</p></section>)}</div></ResumeSection> : null;
    }

    const custom = resume.customSections.find((section) => section.id === id);
    if (!custom || custom.hidden || (!custom.description && custom.items.length === 0)) return null;
    return <ResumeSection title={custom.title || t("customSections")}>
      {custom.description && <p className="summary-copy custom-description">{custom.description}</p>}
      <div className="resume-list">{custom.items.map((item) => <section className="resume-item compact-item" key={item.id}><div className="resume-item-heading"><div><h4>{item.url ? <a href={linkHref(item.url)}>{item.title}</a> : item.title}</h4></div><time>{item.startDate}{item.startDate && item.endDate ? " — " : ""}{item.endDate}</time></div>{item.description && <p className="item-description">{item.description}</p>}</section>)}</div>
    </ResumeSection>;
  };

  const renderOrderedSection = (id: string) => {
    const content = renderSection(id);
    return content ? <div className={`ordered-section section-${id}`} key={id}>{content}</div> : null;
  };
  const twoColumnSections = splitTwoColumnSections(resume.sectionOrder);

  return (
    <article
      className={`resume-page resume-template template-${resume.settings.template} font-${resume.settings.fontFamily} size-${resume.settings.fontSize} density-${resume.settings.density} margins-${resume.settings.margins} divider-${resume.settings.dividerStyle} page-${resume.settings.pageSize}`}
      style={{ "--resume-accent": resume.settings.accentColor } as React.CSSProperties}
      aria-label={t("resumePreviewAria")}
    >
      <header className="resume-header">
        {resume.settings.showPhoto && resume.settings.template !== "ats-classic" && photoUrl && <div className={`resume-photo shape-${resume.settings.photoShape}`}><img src={photoUrl} alt="" style={{ objectPosition: `${resume.settings.photoPositionX}% ${resume.settings.photoPositionY}%`, transform: `scale(${resume.settings.photoZoom})` }} /></div>}
        <div className="resume-identity">
          <h2>{personal.fullName || t("yourName")}</h2>
          <p className="resume-title">{personal.professionalTitle || t("professionalTitleFallback")}</p>
          <div className="contact-row">
            {personal.email && <a href={`mailto:${personal.email}`}><Mail size={11} />{personal.email}</a>}
            {personal.phone && <a href={`tel:${personal.phone}`}><Phone size={11} />{personal.phone}</a>}
            {location && <span><MapPin size={11} />{location}</span>}
          </div>
          {links.length > 0 && <div className="link-row">{links.map((link) => <a href={linkHref(link)} key={link}>{cleanUrl(link)}</a>)}</div>}
        </div>
      </header>

      {resume.settings.template === "two-column" ? (
        <div className="resume-sections two-column-sections">
          <div className="resume-sidebar">{twoColumnSections.sidebar.map(renderOrderedSection)}</div>
          <div className="resume-main">{twoColumnSections.main.map(renderOrderedSection)}</div>
        </div>
      ) : <div className="resume-sections">{resume.sectionOrder.map(renderOrderedSection)}</div>}
    </article>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="resume-section"><h3>{title}</h3>{children}</section>;
}
