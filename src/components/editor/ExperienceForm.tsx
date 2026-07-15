import { BriefcaseBusiness, Copy, Plus, Trash2, X } from "lucide-react";
import type { Translator } from "../../data/translations";
import type { ExperienceItem } from "../../types/resume";
import { Accordion } from "./Accordion";

interface Props {
  items: ExperienceItem[];
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<ExperienceItem>) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onAchievementChange: (id: string, index: number, value: string) => void;
  onAchievementAdd: (id: string) => void;
  onAchievementRemove: (id: string, index: number) => void;
  t: Translator;
}

export function ExperienceForm(props: Props) {
  const { t } = props;
  return (
    <Accordion title={t("experience")} description={t("experienceHelp")} icon={<BriefcaseBusiness size={18} />} defaultOpen badge={`${props.items.length} ${t(props.items.length === 1 ? "role" : "roles")}`}>
      <div className="item-stack">
        {props.items.map((item, itemIndex) => (
          <article className="experience-card" key={item.id} aria-posinset={itemIndex + 1} aria-setsize={props.items.length}>
            <header><span className="item-number" aria-hidden="true">{itemIndex + 1}</span><div><strong>{item.position || t("newRole")}</strong><small>{item.company || t("addCompany")}</small></div><div className="item-actions"><button type="button" title={t("duplicateExperience")} aria-label={t("duplicateExperience")} onClick={() => props.onDuplicate(item.id)}><Copy size={16} /></button><button type="button" className="danger-icon" title={t("deleteExperience")} aria-label={t("deleteExperience")} onClick={() => props.onRemove(item.id)}><Trash2 size={16} /></button></div></header>
            <div className="form-grid compact-grid">
              <label className="field"><span>{t("position")}</span><input value={item.position} onChange={(e) => props.onUpdate(item.id, { position: e.target.value })} placeholder={t("professionalTitlePlaceholder")} /></label>
              <label className="field"><span>{t("company")}</span><input value={item.company} onChange={(e) => props.onUpdate(item.id, { company: e.target.value })} placeholder={t("companyPlaceholder")} /></label>
              <label className="field"><span>{t("location")}</span><input value={item.location} onChange={(e) => props.onUpdate(item.id, { location: e.target.value })} placeholder={t("locationPlaceholder")} /></label>
              <label className="field"><span>{t("workMode")}</span><select value={item.workMode} onChange={(e) => props.onUpdate(item.id, { workMode: e.target.value as ExperienceItem["workMode"] })}><option value="onsite">{t("onsite")}</option><option value="hybrid">{t("hybrid")}</option><option value="remote">{t("remote")}</option></select></label>
              <label className="field"><span>{t("startDate")}</span><input type="month" value={item.startDate} onChange={(e) => props.onUpdate(item.id, { startDate: e.target.value })} /></label>
              <label className="field"><span>{t("endDate")}</span><input type="month" value={item.endDate} disabled={item.current} onChange={(e) => props.onUpdate(item.id, { endDate: e.target.value })} /></label>
              <label className="check-field field-wide"><input type="checkbox" checked={item.current} onChange={(e) => props.onUpdate(item.id, { current: e.target.checked, endDate: e.target.checked ? "" : item.endDate })} /><span>{t("currentJob")}</span></label>
              <label className="field field-wide"><span>{t("description")}</span><textarea rows={3} value={item.description} onChange={(e) => props.onUpdate(item.id, { description: e.target.value })} placeholder={t("descriptionPlaceholder")} maxLength={650} /></label>
            </div>
            <div className="achievements"><span className="sub-label">{t("achievements")}</span>{item.achievements.map((achievement, index) => <div className="achievement-row" key={`${item.id}-${index}`}><span aria-hidden="true">•</span><input value={achievement} onChange={(e) => props.onAchievementChange(item.id, index, e.target.value)} placeholder={t("achievementPlaceholder")} maxLength={240} /><button type="button" title={t("deleteAchievement")} aria-label={t("deleteAchievement")} onClick={() => props.onAchievementRemove(item.id, index)}><X size={15} /></button></div>)}<button className="text-button" type="button" onClick={() => props.onAchievementAdd(item.id)}><Plus size={15} /> {t("addAchievement")}</button></div>
          </article>
        ))}
        {props.items.length === 0 && <div className="empty-section"><BriefcaseBusiness size={25} /><strong>{t("noExperience")}</strong><span>{t("noExperienceHelp")}</span></div>}
      </div>
      <button className="add-button" type="button" onClick={props.onAdd}><Plus size={17} /> {t("addExperience")}</button>
    </Accordion>
  );
}
