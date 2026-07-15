import { BadgeCheck, Minus, Plus, Printer } from "lucide-react";
import { useState } from "react";
import { getTranslator } from "../../data/translations";
import type { ResumeData } from "../../types/resume";
import { AtsClassicTemplate } from "./AtsClassicTemplate";

interface Props { resume: ResumeData; }

export function PreviewPanel({ resume }: Props) {
  const [zoom, setZoom] = useState(72);
  const t = getTranslator(resume.language);
  return (
    <section className="preview-panel" aria-label={t("preview")}>
      <div className="preview-toolbar">
        <div><span className="eyebrow">{t("preview")}</span><h2>{t("atsClassic")}</h2></div>
        <span className="ats-badge"><BadgeCheck size={14} /> {t("atsBadge")}</span>
        <div className="preview-actions">
          <div className="zoom-control"><button type="button" title={t("zoomOut")} onClick={() => setZoom((value) => Math.max(46, value - 8))}><Minus size={15} /></button><output>{zoom}%</output><button type="button" title={t("zoomIn")} onClick={() => setZoom((value) => Math.min(100, value + 8))}><Plus size={15} /></button></div>
          <button className="print-button" type="button" onClick={() => window.print()}><Printer size={16} /> {t("print")}</button>
        </div>
      </div>
      <div className="preview-scroll">
        <div className="page-stage" style={{ "--preview-scale": zoom / 100 } as React.CSSProperties}>
          <div className="page-label">{t("page")} 1 · A4</div>
          <AtsClassicTemplate resume={resume} />
        </div>
      </div>
    </section>
  );
}
