import { useEffect, useState } from "react";
import { Eye, FileText, Languages, LayoutTemplate, Leaf, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "./components/common/BrandLogo";
import { EditorPanel } from "./components/editor/EditorPanel";
import { ResumeDesignPanel } from "./components/editor/ResumeDesignPanel";
import { PreviewPanel } from "./components/preview/PreviewPanel";
import { getTranslator } from "./data/translations";
import { useResume } from "./hooks/useResume";
import type { AppLanguage } from "./types/resume";

type MobileTab = "edit" | "design" | "preview";

export default function App() {
  const resumeState = useResume();
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const t = getTranslator(resumeState.resume.language);

  useEffect(() => {
    document.documentElement.lang = resumeState.resume.language === "pt" ? "pt-BR" : resumeState.resume.language;
    document.title = "BeeTales Resume Builder";
  }, [resumeState.resume.language]);

  const confirmEmpty = () => {
    if (window.confirm(t("emptyResumeConfirm"))) resumeState.createEmpty();
  };

  const confirmExample = () => {
    if (window.confirm(t("useExampleConfirm"))) resumeState.useExample();
  };

  const changeLanguage = (language: AppLanguage) => {
    resumeState.setResume((current) => ({ ...current, language }));
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <BrandLogo />
        <div className="header-center"><Leaf size={14} /><span>{t("privateByDesign")}</span><i aria-hidden="true" /><span>{t("browserOnly")}</span></div>
        <div className="header-actions">
          <label className="language-select">
            <Languages size={15} aria-hidden="true" />
            <span className="sr-only">{t("languageLabel")}</span>
            <select value={resumeState.resume.language} onChange={(event) => changeLanguage(event.target.value as AppLanguage)} aria-label={t("languageLabel")}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="pl">Polski</option>
              <option value="pt">Português</option>
            </select>
          </label>
          <span className={`save-state save-${resumeState.saveStatus}`}><span className="save-dot" />{resumeState.saveStatus === "saved" ? t("savedLocally") : resumeState.saveStatus === "saving" ? t("saving") : t("saveError")}</span>
          <button type="button" className="quiet-action" aria-label={t("useExample")} onClick={confirmExample}><Sparkles size={16} /> <span>{t("useExampleShort")}</span></button>
          <button type="button" className="quiet-action" aria-label={t("emptyResume")} onClick={confirmEmpty}><RotateCcw size={16} /> <span>{t("emptyResumeShort")}</span></button>
        </div>
      </header>

      <div className="privacy-banner">
        <img className="sora-avatar" src={`${import.meta.env.BASE_URL}assets/sora-avatar.png`} alt={t("soraAlt")} />
        <ShieldCheck size={18} aria-hidden="true" />
        <p><strong>{t("privacyLead")}</strong> {t("privacyBody")}</p>
      </div>

      <nav className="mobile-tabs" aria-label={t("appSections")}>
        <button className={mobileTab === "edit" ? "active" : ""} onClick={() => setMobileTab("edit")}><FileText size={17} /> {t("edit")}</button>
        <button className={mobileTab === "design" ? "active" : ""} onClick={() => setMobileTab("design")}><LayoutTemplate size={17} /> {t("design")}</button>
        <button className={mobileTab === "preview" ? "active" : ""} onClick={() => setMobileTab("preview")}><Eye size={17} /> {t("preview")}</button>
      </nav>

      <main className="workspace">
        <div className={`workspace-editor ${mobileTab !== "edit" ? "mobile-hidden" : ""}`}><EditorPanel {...resumeState} t={t} /></div>
        <div className={`workspace-design ${mobileTab !== "design" ? "mobile-hidden" : ""}`}><ResumeDesignPanel resume={resumeState.resume} setResume={resumeState.setResume} t={t} photoUrl={resumeState.photoUrl} photoError={resumeState.photoError} uploadPhoto={resumeState.uploadPhoto} removePhoto={resumeState.removePhoto} standalone /></div>
        <div className={`workspace-preview ${mobileTab !== "preview" ? "mobile-hidden" : ""}`}><PreviewPanel resume={resumeState.resume} photoUrl={resumeState.photoUrl} /></div>
      </main>
    </div>
  );
}
