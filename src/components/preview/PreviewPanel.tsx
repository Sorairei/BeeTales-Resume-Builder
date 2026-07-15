import { AlertTriangle, BadgeCheck, FileDown, Maximize2, Minus, Plus, Printer } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { getTranslator } from "../../data/translations";
import { printResume } from "../../services/printService";
import type { ResumeData } from "../../types/resume";
import { AtsClassicTemplate } from "./AtsClassicTemplate";

interface Props { resume: ResumeData; photoUrl?: string; onPageCountChange?: (count: number) => void; }

const templateKeys = { "ats-classic": "atsClassic", modern: "modernTemplate", executive: "executiveTemplate", "two-column": "twoColumnTemplate" } as const;

export function PreviewPanel({ resume, photoUrl, onPageCountChange }: Props) {
  const [zoom, setZoom] = useState(72);
  const [pageCount, setPageCount] = useState(1);
  const [lastPageFill, setLastPageFill] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = getTranslator(resume.language);
  const pageHeight = resume.settings.pageSize === "a4" ? 1123 : 1056;

  const measurePages = useCallback(() => {
    const page = contentRef.current?.querySelector<HTMLElement>(".resume-page");
    if (!page) return;
    const contentHeight = Math.max(pageHeight, page.scrollHeight);
    const nextCount = Math.max(1, Math.ceil(contentHeight / pageHeight));
    const nextFill = (contentHeight - ((nextCount - 1) * pageHeight)) / pageHeight;
    setPageCount(nextCount); setLastPageFill(nextFill); onPageCountChange?.(nextCount);
  }, [onPageCountChange, pageHeight]);

  useLayoutEffect(() => {
    measurePages();
    const page = contentRef.current?.querySelector<HTMLElement>(".resume-page");
    if (!page || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measurePages); observer.observe(page);
    return () => observer.disconnect();
  }, [measurePages, resume, photoUrl]);

  const fitWidth = () => {
    const available = (scrollRef.current?.clientWidth ?? 850) - 34;
    const width = resume.settings.pageSize === "a4" ? 794 : 816;
    setZoom(Math.max(40, Math.min(100, Math.floor((available / width) * 100))));
  };
  const overloaded = pageCount > 2 || (pageCount > 1 && lastPageFill > .92);
  return (
    <section className="preview-panel" aria-label={t("preview")}>
      <div className="preview-toolbar">
        <div><span className="eyebrow">{t("preview")}</span><h2>{t(templateKeys[resume.settings.template])}</h2></div>
        <span className="ats-badge"><BadgeCheck size={14} /> {pageCount} {pageCount === 1 ? t("pageLower") : t("pagesLower")}</span>
        <div className="preview-actions">
          <div className="zoom-control"><button type="button" title={t("zoomOut")} onClick={() => setZoom((value) => Math.max(40, value - 8))}><Minus size={15} /></button><output>{zoom}%</output><button type="button" title={t("zoomIn")} onClick={() => setZoom((value) => Math.min(100, value + 8))}><Plus size={15} /></button><button type="button" title={t("fitWidth")} onClick={fitWidth}><Maximize2 size={15} /></button><button type="button" title={t("view100")} onClick={() => setZoom(100)}>100</button></div>
          <button className="pdf-button" type="button" onClick={() => printResume(resume.personal.fullName)} title={t("savePdfHelp")}><FileDown size={16} /> {t("downloadPdf")}</button>
          <button className="print-button secondary" type="button" onClick={() => printResume(resume.personal.fullName)}><Printer size={16} /> {t("print")}</button>
        </div>
      </div>
      <div className="preview-body">
        {overloaded && <div className="overflow-warning"><AlertTriangle size={15} /><span><strong>{t("contentOverflow")}</strong>{t(pageCount > 2 ? "moreThanTwoPages" : "pageVeryFull")}</span></div>}
        <div className="preview-scroll" ref={scrollRef}>
        <div ref={contentRef} className={`page-stage stage-${resume.settings.pageSize}`} style={{ "--preview-scale": zoom / 100, "--page-count": pageCount } as React.CSSProperties}>
          {Array.from({ length: pageCount }, (_, index) => <div className="page-marker" style={{ "--page-index": index } as React.CSSProperties} key={index}><span>{t("page")} {index + 1} · {resume.settings.pageSize === "a4" ? "A4" : t("letter")}</span>{index > 0 && <i />}</div>)}
          <AtsClassicTemplate resume={resume} photoUrl={photoUrl} />
        </div></div>
      </div>
    </section>
  );
}
