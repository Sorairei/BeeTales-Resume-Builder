import type { Dispatch, SetStateAction } from "react";
import { AlertTriangle, Check, ImagePlus, LayoutTemplate, RotateCcw, Trash2 } from "lucide-react";
import { palettes } from "../../data/palettes";
import type { TranslationKey, Translator } from "../../data/translations";
import type { ResumeData, ResumeSettings, ResumeTemplate } from "../../types/resume";
import { contrastRatio, hasSafeAccentContrast } from "../../utils/contrast";
import { Accordion } from "./Accordion";

interface Props {
  resume: ResumeData;
  setResume: Dispatch<SetStateAction<ResumeData>>;
  t: Translator;
  photoUrl?: string;
  photoError?: string;
  uploadPhoto: (file: File) => Promise<void>;
  removePhoto: () => Promise<void>;
  standalone?: boolean;
}

const templates: Array<{ id: ResumeTemplate; name: TranslationKey; description: TranslationKey; ats: TranslationKey; photo: boolean }> = [
  { id: "ats-classic", name: "atsClassic", description: "atsTemplateDescription", ats: "atsHigh", photo: false },
  { id: "modern", name: "modernTemplate", description: "modernTemplateDescription", ats: "atsMediumHigh", photo: true },
  { id: "executive", name: "executiveTemplate", description: "executiveTemplateDescription", ats: "atsMediumHigh", photo: true },
  { id: "two-column", name: "twoColumnTemplate", description: "twoColumnTemplateDescription", ats: "atsMedium", photo: true },
];

export function ResumeDesignPanel({ resume, setResume, t, photoUrl, photoError, uploadPhoto, removePhoto, standalone = false }: Props) {
  const settings = resume.settings;
  const update = (patch: Partial<ResumeSettings>) => setResume((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  const contrast = contrastRatio(settings.accentColor);
  const safeContrast = hasSafeAccentContrast(settings.accentColor);

  const content = <div className="design-panel-content">
    <div className="design-group">
      <div className="design-group-heading"><strong>{t("chooseTemplate")}</strong><span>{t("templateChangeSafe")}</span></div>
      <div className="template-grid">{templates.map((template) => <button type="button" key={template.id} className={`template-card ${settings.template === template.id ? "selected" : ""}`} onClick={() => update({ template: template.id })}>
        <span className={`template-thumbnail thumbnail-${template.id}`} aria-hidden="true"><i /><b /><em /></span>
        <span className="template-card-copy"><strong>{t(template.name)}</strong><small>{t(template.description)}</small><span>{t(template.ats)} · {template.photo ? t("photoAllowed") : t("noPhoto")}</span></span>
        {settings.template === template.id && <span className="template-selected"><Check size={14} /></span>}
      </button>)}</div>
      {settings.template === "two-column" && <p className="design-warning"><AlertTriangle size={15} />{t("twoColumnWarning")}</p>}
    </div>

    <div className="design-group">
      <div className="design-group-heading"><strong>{t("accentColor")}</strong><span>{t("accentColorHelp")}</span></div>
      <div className="palette-row">{palettes.map((palette) => <button type="button" key={palette.id} className={settings.accentColor.toLowerCase() === palette.color.toLowerCase() ? "selected" : ""} style={{ "--swatch": palette.color } as React.CSSProperties} title={t(`palette_${palette.id}` as TranslationKey)} onClick={() => update({ accentColor: palette.color })}><span /></button>)}</div>
      <div className="custom-color-row"><label><span>{t("customColor")}</span><input type="color" value={settings.accentColor} onChange={(event) => update({ accentColor: event.target.value.toUpperCase() })} /></label><output>{settings.accentColor.toUpperCase()}</output><button type="button" className="mini-action" onClick={() => update({ accentColor: "#374151" })}><RotateCcw size={14} />{t("restoreDefault")}</button></div>
      <p className={`contrast-status ${safeContrast ? "safe" : "warning"}`}>{safeContrast ? <Check size={14} /> : <AlertTriangle size={14} />}{safeContrast ? t("contrastGood") : t("contrastWarning")} · {contrast.toFixed(1)}:1</p>
    </div>

    <div className="design-group design-options-grid">
      <label className="field"><span>{t("fontFamily")}</span><select value={settings.fontFamily} onChange={(event) => update({ fontFamily: event.target.value as ResumeSettings["fontFamily"] })}><option value="inter">Inter</option><option value="arial">Arial</option><option value="helvetica">Helvetica</option><option value="source-sans">Source Sans 3</option><option value="georgia">Georgia</option><option value="merriweather">Merriweather</option></select></label>
      <label className="field"><span>{t("fontSize")}</span><select value={settings.fontSize} onChange={(event) => update({ fontSize: event.target.value as ResumeSettings["fontSize"] })}><option value="small">{t("small")}</option><option value="medium">{t("medium")}</option><option value="large">{t("large")}</option></select></label>
      <label className="field"><span>{t("density")}</span><select value={settings.density} onChange={(event) => update({ density: event.target.value as ResumeSettings["density"] })}><option value="compact">{t("compact")}</option><option value="normal">{t("normal")}</option><option value="spacious">{t("spacious")}</option></select></label>
      <label className="field"><span>{t("margins")}</span><select value={settings.margins} onChange={(event) => update({ margins: event.target.value as ResumeSettings["margins"] })}><option value="narrow">{t("narrow")}</option><option value="normal">{t("normal")}</option><option value="wide">{t("wide")}</option></select></label>
      <label className="field"><span>{t("dividerStyle")}</span><select value={settings.dividerStyle} onChange={(event) => update({ dividerStyle: event.target.value as ResumeSettings["dividerStyle"] })}><option value="solid">{t("solidLine")}</option><option value="thin">{t("thinLine")}</option><option value="none">{t("noLine")}</option></select></label>
      <label className="field"><span>{t("pageSize")}</span><select value={settings.pageSize} onChange={(event) => update({ pageSize: event.target.value as ResumeSettings["pageSize"] })}><option value="a4">A4</option><option value="letter">{t("letter")}</option></select></label>
    </div>

    <div className="design-group photo-design-group">
      <div className="design-group-heading"><strong>{t("profilePhoto")}</strong><span>{t("photoStoredLocally")}</span></div>
      <div className="photo-workspace">
        <div className={`photo-crop-preview shape-${settings.photoShape}`}>
          {photoUrl ? <img src={photoUrl} alt={t("photoPreviewAlt")} style={{ objectPosition: `${settings.photoPositionX}% ${settings.photoPositionY}%`, transform: `scale(${settings.photoZoom})` }} /> : <ImagePlus size={28} />}
        </div>
        <div className="photo-controls">
          <label className="photo-upload-button"><ImagePlus size={15} />{photoUrl ? t("replacePhoto") : t("uploadPhoto")}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadPhoto(file); event.target.value = ""; }} /></label>
          {photoUrl && <button type="button" className="photo-delete-button" onClick={() => void removePhoto()}><Trash2 size={15} />{t("removePhoto")}</button>}
          <label className="check-field"><input type="checkbox" checked={settings.showPhoto} disabled={!photoUrl} onChange={(event) => update({ showPhoto: event.target.checked })} /><span>{t("showPhoto")}</span></label>
          <label className="field"><span>{t("photoShape")}</span><select value={settings.photoShape} onChange={(event) => update({ photoShape: event.target.value as ResumeSettings["photoShape"] })}><option value="circle">{t("circle")}</option><option value="rectangle">{t("rectangle")}</option></select></label>
        </div>
      </div>
      {photoUrl && <div className="photo-sliders">
        <label><span>{t("photoZoom")}</span><input type="range" min="1" max="2" step="0.05" value={settings.photoZoom} onChange={(event) => update({ photoZoom: Number(event.target.value) })} /></label>
        <label><span>{t("horizontalPosition")}</span><input type="range" min="0" max="100" value={settings.photoPositionX} onChange={(event) => update({ photoPositionX: Number(event.target.value) })} /></label>
        <label><span>{t("verticalPosition")}</span><input type="range" min="0" max="100" value={settings.photoPositionY} onChange={(event) => update({ photoPositionY: Number(event.target.value) })} /></label>
      </div>}
      {settings.template === "ats-classic" && photoUrl && <p className="design-warning subtle"><AlertTriangle size={15} />{t("atsPhotoHidden")}</p>}
      {photoError && <p className="design-warning"><AlertTriangle size={15} />{t("photoError")}</p>}
    </div>
  </div>;

  if (standalone) return <section className="mobile-design-panel"><div className="panel-heading compact"><div className="panel-heading-icon"><LayoutTemplate size={19} /></div><div><span className="eyebrow">{t("design")}</span><h1>{t("resumeDesign")}</h1><p>{t("resumeDesignHelp")}</p></div></div>{content}</section>;
  return <Accordion title={t("resumeDesign")} description={t("resumeDesignHelp")} icon={<LayoutTemplate size={18} />} badge={t("stageThree")}>{content}</Accordion>;
}
