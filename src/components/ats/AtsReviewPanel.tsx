import { AlertTriangle, CheckCircle2, Info, SearchCheck } from "lucide-react";
import type { Translator } from "../../data/translations";
import type { ResumeData } from "../../types/resume";
import { analyzeResume, type AtsSeverity } from "../../utils/atsAnalyzer";
import { Accordion } from "../editor/Accordion";

interface Props { resume: ResumeData; pageCount: number; t: Translator; standalone?: boolean; }

const severityIcon: Record<AtsSeverity, React.ReactNode> = {
  correct: <CheckCircle2 size={16} />, recommendation: <Info size={16} />, warning: <AlertTriangle size={16} />,
};

export function AtsReviewPanel({ resume, pageCount, t, standalone = false }: Props) {
  const analysis = analyzeResume(resume, pageCount);
  const scoreTone = analysis.score >= 85 ? "strong" : analysis.score >= 65 ? "medium" : "weak";
  const content = <div className="ats-review-content">
    <div className={`ats-score-card score-${scoreTone}`}>
      <div className="ats-score-ring" style={{ "--score": `${analysis.score * 3.6}deg` } as React.CSSProperties}><strong>{analysis.score}</strong><span>/ 100</span></div>
      <div><strong>{t(analysis.score >= 85 ? "atsScoreStrong" : analysis.score >= 65 ? "atsScoreMedium" : "atsScoreWeak")}</strong><p>{t("atsScoreExplanation")}</p><div className="ats-counts"><span className="correct">{analysis.counts.correct} {t("correct")}</span><span className="recommendation">{analysis.counts.recommendation} {t("recommendations")}</span><span className="warning">{analysis.counts.warning} {t("warnings")}</span></div></div>
    </div>
    <div className="ats-observation-list">{analysis.observations.map((item, index) => <div className={`ats-observation severity-${item.severity}`} key={`${item.key}-${index}`}><span>{severityIcon[item.severity]}</span><div><strong>{t(item.severity)}</strong><p>{t(item.key)}</p>{item.deduction > 0 && <small>-{item.deduction} {t("points")}</small>}</div></div>)}</div>
    <p className="ats-disclaimer"><Info size={15} />{t("atsDisclaimer")}</p>
  </div>;

  if (standalone) return <section className="mobile-review-panel"><div className="panel-heading compact"><div className="panel-heading-icon"><SearchCheck size={19} /></div><div><span className="eyebrow">{t("review")}</span><h1>{t("resumeReview")}</h1><p>{t("resumeReviewHelp")}</p></div></div>{content}</section>;
  return <Accordion title={t("resumeReview")} description={t("resumeReviewHelp")} icon={<SearchCheck size={18} />} badge={`${analysis.score}/100`}>{content}</Accordion>;
}
