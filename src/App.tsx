import { useEffect, useState } from "react";
import { Code2, Eye, FileText, Heart, Languages, LayoutTemplate, Leaf, RotateCcw, Scale, SearchCheck, ShieldCheck, Sparkles } from "lucide-react";
import { AtsReviewPanel } from "./components/ats/AtsReviewPanel";
import { BrandLogo } from "./components/common/BrandLogo";
import { EditorPanel } from "./components/editor/EditorPanel";
import { ResumeDesignPanel } from "./components/editor/ResumeDesignPanel";
import { PreviewPanel } from "./components/preview/PreviewPanel";
import { getTranslator } from "./data/translations";
import { useResume } from "./hooks/useResume";
import type { AppLanguage } from "./types/resume";

type MobileTab = "edit" | "design" | "review" | "preview";

export default function App() {
  const resumeState = useResume();
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const [pageCount, setPageCount] = useState(1);
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
      <a className="skip-link" href="#main-content">{t("content")}</a>
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
          <span className={`save-state save-${resumeState.saveStatus}`} role="status" aria-live="polite"><span className="save-dot" />{resumeState.saveStatus === "saved" ? t("savedLocally") : resumeState.saveStatus === "saving" ? t("saving") : t("saveError")}</span>
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
        <button type="button" aria-pressed={mobileTab === "edit"} className={mobileTab === "edit" ? "active" : ""} onClick={() => setMobileTab("edit")}><FileText size={17} /> {t("edit")}</button>
        <button type="button" aria-pressed={mobileTab === "design"} className={mobileTab === "design" ? "active" : ""} onClick={() => setMobileTab("design")}><LayoutTemplate size={17} /> {t("design")}</button>
        <button type="button" aria-pressed={mobileTab === "review"} className={mobileTab === "review" ? "active" : ""} onClick={() => setMobileTab("review")}><SearchCheck size={17} /> {t("review")}</button>
        <button type="button" aria-pressed={mobileTab === "preview"} className={mobileTab === "preview" ? "active" : ""} onClick={() => setMobileTab("preview")}><Eye size={17} /> {t("preview")}</button>
      </nav>

      <main className="workspace" id="main-content">
        <div className={`workspace-editor ${mobileTab !== "edit" ? "mobile-hidden" : ""}`}><EditorPanel {...resumeState} pageCount={pageCount} t={t} /></div>
        <div className={`workspace-design ${mobileTab !== "design" ? "mobile-hidden" : ""}`}><ResumeDesignPanel resume={resumeState.resume} setResume={resumeState.setResume} t={t} photoUrl={resumeState.photoUrl} photoError={resumeState.photoError} uploadPhoto={resumeState.uploadPhoto} removePhoto={resumeState.removePhoto} standalone /></div>
        <div className={`workspace-review ${mobileTab !== "review" ? "mobile-hidden" : ""}`}><AtsReviewPanel resume={resumeState.resume} pageCount={pageCount} t={t} standalone /></div>
        <div className={`workspace-preview ${mobileTab !== "preview" ? "mobile-hidden" : ""}`}><PreviewPanel resume={resumeState.resume} photoUrl={resumeState.photoUrl} onPageCountChange={setPageCount} /></div>
      </main>

      <footer className="app-footer">
        <div className="footer-owner">
          <span>© {new Date().getFullYear()} BeeTales</span>
          <a href="https://github.com/Sorairei" target="_blank" rel="noreferrer">
            <Code2 size={14} aria-hidden="true" /> {t("createdBy")} Sorairei
          </a>
        </div>
        <nav className="footer-links" aria-label={t("footerLinks")}>
          <a href="https://github.com/Sorairei/BeeTales-Resume-Builder" target="_blank" rel="noreferrer">
            <Code2 size={14} aria-hidden="true" /> {t("sourceCode")}
          </a>
          <a href="https://github.com/Sorairei/BeeTales-Resume-Builder/blob/main/LICENSE" target="_blank" rel="noreferrer">
            <Scale size={14} aria-hidden="true" /> {t("mitLicense")}
          </a>
        </nav>
        <a className="github-sponsor-button" href="https://github.com/sponsors/Sorairei" target="_blank" rel="noreferrer" aria-label={t("sponsorProjectHelp")} title={t("sponsorProjectHelp")}>
          <Heart size={15} aria-hidden="true" /> {t("sponsorProject")}
        </a>
      </footer>
    </div>
  );
}
