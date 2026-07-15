import type { Dispatch, SetStateAction } from "react";
import { ArrowDown, ArrowUp, Award, BookOpen, ContactRound, FolderKanban, GraduationCap, Languages, Plus, Shapes, Trash2, Wrench } from "lucide-react";
import type { TranslationKey, Translator } from "../../data/translations";
import type { CertificationItem, CourseItem, CustomSection, EducationItem, LanguageItem, ProjectItem, ReferenceItem, ResumeData, SkillItem } from "../../types/resume";
import { createId } from "../../utils/id";
import { moveItem } from "../../utils/arrays";
import { isValidEmail, isValidPhone, isValidWebAddress } from "../../utils/validation";
import { CollectionSection } from "./CollectionSection";

interface Props { resume: ResumeData; setResume: Dispatch<SetStateAction<ResumeData>>; t: Translator; }

const field = (label: string, control: React.ReactNode, wide = false) => <label className={`field ${wide ? "field-wide" : ""}`}><span>{label}</span>{control}</label>;
const validatedField = (label: string, control: React.ReactNode, issue: TranslationKey | undefined, t: Translator, wide = false) => <label className={`field ${wide ? "field-wide" : ""} ${issue ? "field-invalid" : ""}`}><span>{label}</span>{control}{issue && <small className="field-error">{t(issue)}</small>}</label>;

export function Stage2Sections({ resume, setResume, t }: Props) {
  const setCollection = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => setResume((current) => ({ ...current, [key]: value }));

  return (
    <>
      <CollectionSection<EducationItem>
        title={t("education")} description={t("educationHelp")} icon={<GraduationCap size={18} />} items={resume.education} onChange={(items) => setCollection("education", items)}
        createItem={() => ({ id: createId("education"), institution: "", degree: "", field: "", location: "", startDate: "", endDate: "", status: "", description: "" })}
        getItemTitle={(item) => item.degree || t("newEducation")} getItemSubtitle={(item) => item.institution || t("addInstitution")}
        addLabel={t("addEducation")} emptyLabel={t("noEducation")} emptyHelp={t("noEducationHelp")} t={t}
        renderFields={(item, update) => <div className="form-grid compact-grid">
          {field(t("institution"), <input value={item.institution} onChange={(e) => update({ institution: e.target.value })} placeholder={t("institutionPlaceholder")} />)}
          {field(t("degree"), <input value={item.degree} onChange={(e) => update({ degree: e.target.value })} placeholder={t("degreePlaceholder")} />)}
          {field(t("fieldOfStudy"), <input value={item.field} onChange={(e) => update({ field: e.target.value })} placeholder={t("optional")} />)}
          {field(t("location"), <input value={item.location} onChange={(e) => update({ location: e.target.value })} placeholder={t("locationPlaceholder")} />)}
          {field(t("startDate"), <input type="month" value={item.startDate} onChange={(e) => update({ startDate: e.target.value })} />)}
          {field(t("endDate"), <input type="month" value={item.endDate} onChange={(e) => update({ endDate: e.target.value })} />)}
          {field(t("status"), <input value={item.status} onChange={(e) => update({ status: e.target.value })} placeholder={t("statusPlaceholder")} />, true)}
          {field(t("description"), <textarea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder={t("optional")} />, true)}
        </div>}
      />

      <CollectionSection<SkillItem>
        title={t("skills")} description={t("skillsHelp")} icon={<Wrench size={18} />} items={resume.skills} onChange={(items) => setCollection("skills", items)}
        createItem={() => ({ id: createId("skill"), name: "", category: "", level: "" })}
        getItemTitle={(item) => item.name || t("newSkill")} getItemSubtitle={(item) => item.category || t("uncategorized")}
        addLabel={t("addSkill")} emptyLabel={t("noSkills")} emptyHelp={t("noSkillsHelp")} t={t} allowDuplicate={false}
        renderFields={(item, update) => <div className="form-grid compact-grid">
          {field(t("skillName"), <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder={t("skillPlaceholder")} />)}
          {field(t("category"), <input value={item.category} onChange={(e) => update({ category: e.target.value })} placeholder={t("categoryPlaceholder")} />)}
          {field(t("level"), <input value={item.level} onChange={(e) => update({ level: e.target.value })} placeholder={t("optional")} />, true)}
        </div>}
      />

      <CollectionSection<LanguageItem>
        title={t("languages")} description={t("languagesHelp")} icon={<Languages size={18} />} items={resume.languages} onChange={(items) => setCollection("languages", items)}
        createItem={() => ({ id: createId("language"), name: "", level: "", certification: "", score: "" })}
        getItemTitle={(item) => item.name || t("newLanguage")} getItemSubtitle={(item) => item.level || t("addLevel")}
        addLabel={t("addLanguage")} emptyLabel={t("noLanguages")} emptyHelp={t("noLanguagesHelp")} t={t} allowDuplicate={false}
        renderFields={(item, update) => <div className="form-grid compact-grid">
          {field(t("languageName"), <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder={t("languagePlaceholder")} />)}
          {field(t("level"), <input value={item.level} onChange={(e) => update({ level: e.target.value })} placeholder={t("languageLevelPlaceholder")} />)}
          {field(t("certification"), <input value={item.certification} onChange={(e) => update({ certification: e.target.value })} placeholder={t("optional")} />)}
          {field(t("score"), <input value={item.score} onChange={(e) => update({ score: e.target.value })} placeholder={t("optional")} />)}
        </div>}
      />

      <CollectionSection<CertificationItem>
        title={t("certifications")} description={t("certificationsHelp")} icon={<Award size={18} />} items={resume.certifications} onChange={(items) => setCollection("certifications", items)}
        createItem={() => ({ id: createId("certification"), name: "", issuer: "", issueDate: "", expirationDate: "", credentialId: "", url: "" })}
        getItemTitle={(item) => item.name || t("newCertification")} getItemSubtitle={(item) => item.issuer || t("addIssuer")}
        addLabel={t("addCertification")} emptyLabel={t("noCertifications")} emptyHelp={t("noCertificationsHelp")} t={t}
        renderFields={(item, update) => <div className="form-grid compact-grid">
          {field(t("certificationName"), <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder={t("certificationPlaceholder")} />)}
          {field(t("issuer"), <input value={item.issuer} onChange={(e) => update({ issuer: e.target.value })} placeholder={t("issuerPlaceholder")} />)}
          {field(t("issueDate"), <input type="month" value={item.issueDate} onChange={(e) => update({ issueDate: e.target.value })} />)}
          {field(t("expirationDate"), <input type="month" value={item.expirationDate} onChange={(e) => update({ expirationDate: e.target.value })} />)}
          {field(t("credentialId"), <input value={item.credentialId} onChange={(e) => update({ credentialId: e.target.value })} placeholder={t("optional")} />)}
          {validatedField(t("credentialUrl"), <input type="url" value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://" />, isValidWebAddress(item.url) ? undefined : "invalidUrl", t)}
        </div>}
      />

      <CollectionSection<ProjectItem>
        title={t("projects")} description={t("projectsHelp")} icon={<FolderKanban size={18} />} items={resume.projects} onChange={(items) => setCollection("projects", items)}
        createItem={() => ({ id: createId("project"), name: "", description: "", technologies: [], url: "", repository: "", date: "", achievements: [] })}
        getItemTitle={(item) => item.name || t("newProject")} getItemSubtitle={(item) => item.technologies.join(", ") || t("addTechnologies")}
        addLabel={t("addProject")} emptyLabel={t("noProjects")} emptyHelp={t("noProjectsHelp")} t={t}
        renderFields={(item, update) => <div className="form-grid compact-grid">
          {field(t("projectName"), <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder={t("projectPlaceholder")} />)}
          {field(t("date"), <input value={item.date} onChange={(e) => update({ date: e.target.value })} placeholder="2025" />)}
          {field(t("description"), <textarea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder={t("projectDescriptionPlaceholder")} />, true)}
          {field(t("technologies"), <input value={item.technologies.join(", ")} onChange={(e) => update({ technologies: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} placeholder={t("technologiesPlaceholder")} />, true)}
          {validatedField(t("projectUrl"), <input type="url" value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://" />, isValidWebAddress(item.url) ? undefined : "invalidUrl", t)}
          {validatedField(t("repository"), <input type="url" value={item.repository} onChange={(e) => update({ repository: e.target.value })} placeholder="https://github.com/" />, isValidWebAddress(item.repository) ? undefined : "invalidUrl", t)}
          {field(t("achievements"), <textarea rows={3} value={item.achievements.join("\n")} onChange={(e) => update({ achievements: e.target.value.split("\n") })} placeholder={t("oneAchievementPerLine")} />, true)}
        </div>}
      />

      <CollectionSection<CourseItem>
        title={t("courses")} description={t("coursesHelp")} icon={<BookOpen size={18} />} items={resume.courses} onChange={(items) => setCollection("courses", items)}
        createItem={() => ({ id: createId("course"), name: "", institution: "", date: "", duration: "", description: "", url: "" })}
        getItemTitle={(item) => item.name || t("newCourse")} getItemSubtitle={(item) => item.institution || t("addInstitution")}
        addLabel={t("addCourse")} emptyLabel={t("noCourses")} emptyHelp={t("noCoursesHelp")} t={t} allowDuplicate={false}
        renderFields={(item, update) => <div className="form-grid compact-grid">
          {field(t("courseName"), <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder={t("coursePlaceholder")} />)}
          {field(t("institution"), <input value={item.institution} onChange={(e) => update({ institution: e.target.value })} placeholder={t("institutionPlaceholder")} />)}
          {field(t("date"), <input value={item.date} onChange={(e) => update({ date: e.target.value })} placeholder="2025" />)}
          {field(t("duration"), <input value={item.duration} onChange={(e) => update({ duration: e.target.value })} placeholder={t("durationPlaceholder")} />)}
          {field(t("description"), <textarea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder={t("optional")} />, true)}
          {validatedField(t("courseUrl"), <input type="url" value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://" />, isValidWebAddress(item.url) ? undefined : "invalidUrl", t, true)}
        </div>}
      />

      <CollectionSection<ReferenceItem>
        title={t("references")} description={t("referencesHelp")} icon={<ContactRound size={18} />} items={resume.references} onChange={(items) => setCollection("references", items)}
        createItem={() => ({ id: createId("reference"), name: "", position: "", company: "", relationship: "", phone: "", email: "" })}
        getItemTitle={(item) => item.name || t("newReference")} getItemSubtitle={(item) => item.company || t("addCompany")}
        addLabel={t("addReference")} emptyLabel={t("noReferences")} emptyHelp={t("noReferencesHelp")} t={t} allowDuplicate={false}
        beforeList={<label className="field reference-mode"><span>{t("referenceDisplay")}</span><select value={resume.referenceMode} onChange={(e) => setCollection("referenceMode", e.target.value as ResumeData["referenceMode"])}><option value="full">{t("showReferences")}</option><option value="on-request">{t("onRequestOnly")}</option></select></label>}
        renderFields={(item, update) => <div className="form-grid compact-grid">
          {field(t("fullName"), <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder={t("fullNamePlaceholder")} />)}
          {field(t("position"), <input value={item.position} onChange={(e) => update({ position: e.target.value })} placeholder={t("professionalTitlePlaceholder")} />)}
          {field(t("company"), <input value={item.company} onChange={(e) => update({ company: e.target.value })} placeholder={t("companyPlaceholder")} />)}
          {field(t("relationship"), <input value={item.relationship} onChange={(e) => update({ relationship: e.target.value })} placeholder={t("optional")} />)}
          {validatedField(t("phone"), <input type="tel" value={item.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+1 555 000 0000" />, isValidPhone(item.phone) ? undefined : "invalidPhone", t)}
          {validatedField(t("email"), <input type="email" value={item.email} onChange={(e) => update({ email: e.target.value })} placeholder={t("emailPlaceholder")} />, isValidEmail(item.email) ? undefined : "invalidEmail", t)}
        </div>}
      />

      <CollectionSection<CustomSection>
        title={t("customSections")} description={t("customSectionsHelp")} icon={<Shapes size={18} />} items={resume.customSections}
        onChange={(items) => setResume((current) => {
          const ids = new Set(items.map((item) => item.id));
          const fixed = new Set(["summary", "experience", "education", "skills", "languages", "certifications", "projects", "courses", "references"]);
          const customIds = items.map((item) => item.id);
          let customIndex = 0;
          const sectionOrder = current.sectionOrder
            .filter((id) => fixed.has(id) || ids.has(id))
            .map((id) => fixed.has(id) ? id : customIds[customIndex++]);
          while (customIndex < customIds.length) sectionOrder.push(customIds[customIndex++]);
          return { ...current, customSections: items, sectionOrder, hiddenSections: current.hiddenSections.filter((id) => fixed.has(id) || ids.has(id)) };
        })}
        createItem={() => ({ id: createId("custom"), title: "", description: "", items: [], hidden: false })}
        getItemTitle={(item) => item.title || t("newCustomSection")} getItemSubtitle={(item) => `${item.items.length} ${t("items")}`}
        addLabel={t("addCustomSection")} emptyLabel={t("noCustomSections")} emptyHelp={t("noCustomSectionsHelp")} t={t}
        renderFields={(section, updateSection) => <div className="custom-section-fields">
          <div className="form-grid compact-grid">
            {field(t("sectionTitle"), <input value={section.title} onChange={(e) => updateSection({ title: e.target.value })} placeholder={t("sectionTitlePlaceholder")} />, true)}
            {field(t("sectionDescription"), <textarea rows={2} value={section.description} onChange={(e) => updateSection({ description: e.target.value })} placeholder={t("optional")} />, true)}
          </div>
          <div className="custom-items">
            {section.items.map((item, index) => <div className="custom-item" key={item.id}>
              <div className="custom-item-heading"><strong>{t("item")} {index + 1}</strong><div className="custom-item-actions"><button type="button" title={t("moveUp")} disabled={index === 0} onClick={() => updateSection({ items: moveItem(section.items, index, -1) })}><ArrowUp size={14} /></button><button type="button" title={t("moveDown")} disabled={index === section.items.length - 1} onClick={() => updateSection({ items: moveItem(section.items, index, 1) })}><ArrowDown size={14} /></button><button type="button" title={t("deleteItem")} onClick={() => updateSection({ items: section.items.filter((entry) => entry.id !== item.id) })}><Trash2 size={14} /></button></div></div>
              <div className="form-grid compact-grid">
                {field(t("itemTitle"), <input value={item.title} onChange={(e) => updateSection({ items: section.items.map((entry) => entry.id === item.id ? { ...entry, title: e.target.value } : entry) })} />)}
                {field(t("dateRange"), <div className="date-pair"><input value={item.startDate} onChange={(e) => updateSection({ items: section.items.map((entry) => entry.id === item.id ? { ...entry, startDate: e.target.value } : entry) })} placeholder={t("startDate")} /><input value={item.endDate} onChange={(e) => updateSection({ items: section.items.map((entry) => entry.id === item.id ? { ...entry, endDate: e.target.value } : entry) })} placeholder={t("endDate")} /></div>)}
                {field(t("description"), <textarea rows={2} value={item.description} onChange={(e) => updateSection({ items: section.items.map((entry) => entry.id === item.id ? { ...entry, description: e.target.value } : entry) })} />, true)}
                {validatedField(t("link"), <input type="url" value={item.url} onChange={(e) => updateSection({ items: section.items.map((entry) => entry.id === item.id ? { ...entry, url: e.target.value } : entry) })} placeholder="https://" />, isValidWebAddress(item.url) ? undefined : "invalidUrl", t, true)}
              </div>
            </div>)}
            <button type="button" className="text-button" onClick={() => updateSection({ items: [...section.items, { id: createId("custom-item"), title: "", description: "", startDate: "", endDate: "", url: "" }] })}><Plus size={15} /> {t("addItem")}</button>
          </div>
        </div>}
      />
    </>
  );
}
