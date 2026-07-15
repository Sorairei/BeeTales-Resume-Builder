import type { Dispatch, SetStateAction } from "react";
import { FileText } from "lucide-react";
import type { Translator } from "../../data/translations";
import type { ExperienceItem, PersonalInformation, ResumeData } from "../../types/resume";
import { ExperienceForm } from "./ExperienceForm";
import { PersonalForm } from "./PersonalForm";
import { ResumeDesignPanel } from "./ResumeDesignPanel";
import { SectionManager } from "./SectionManager";
import { Stage2Sections } from "./Stage2Sections";
import { SummaryForm } from "./SummaryForm";

interface Props {
  resume: ResumeData;
  setResume: Dispatch<SetStateAction<ResumeData>>;
  updatePersonal: (field: keyof PersonalInformation, value: string) => void;
  updateExperience: (id: string, patch: Partial<ExperienceItem>) => void;
  updateAchievement: (id: string, index: number, value: string) => void;
  addAchievement: (id: string) => void;
  removeAchievement: (id: string, index: number) => void;
  addExperience: () => void;
  duplicateExperience: (id: string) => void;
  removeExperience: (id: string) => void;
  photoUrl?: string;
  photoError?: string;
  uploadPhoto: (file: File) => Promise<void>;
  removePhoto: () => Promise<void>;
  t: Translator;
}

export function EditorPanel(props: Props) {
  return (
    <section className="editor-panel" aria-label={props.t("editorAria")}>
      <div className="panel-heading"><div className="panel-heading-icon"><FileText size={19} /></div><div><span className="eyebrow">{props.t("content")}</span><h1>{props.t("buildResume")}</h1><p>{props.t("buildResumeHelp")}</p></div></div>
      <div className="editor-design-wrapper"><ResumeDesignPanel resume={props.resume} setResume={props.setResume} t={props.t} photoUrl={props.photoUrl} photoError={props.photoError} uploadPhoto={props.uploadPhoto} removePhoto={props.removePhoto} /></div>
      <SectionManager resume={props.resume} setResume={props.setResume} t={props.t} />
      <PersonalForm personal={props.resume.personal} onChange={props.updatePersonal} t={props.t} />
      <SummaryForm value={props.resume.summary} onChange={(summary) => props.setResume((current) => ({ ...current, summary }))} t={props.t} />
      <ExperienceForm items={props.resume.experience} onAdd={props.addExperience} onUpdate={props.updateExperience} onDuplicate={props.duplicateExperience} onRemove={props.removeExperience} onAchievementChange={props.updateAchievement} onAchievementAdd={props.addAchievement} onAchievementRemove={props.removeAchievement} t={props.t} />
      <Stage2Sections resume={props.resume} setResume={props.setResume} t={props.t} />
    </section>
  );
}
