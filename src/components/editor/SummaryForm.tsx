import { AlignLeft } from "lucide-react";
import type { Translator } from "../../data/translations";
import { Accordion } from "./Accordion";

interface Props { value: string; onChange: (value: string) => void; t: Translator; }

export function SummaryForm({ value, onChange, t }: Props) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  return (
    <Accordion title={t("summary")} description={t("summaryHelp")} icon={<AlignLeft size={18} />} defaultOpen badge={t("recommended")}>
      <label className="field">
        <span>{t("summaryLabel")}</span>
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={6} maxLength={900} placeholder={t("summaryPlaceholder")} />
      </label>
      <div className="field-meta"><span>{t("recommendedLines")}</span><span>{words} {t("words")} · {value.length}/900</span></div>
      {value.length > 0 && value.length < 120 && <p className="inline-tip">{t("summaryTip")}</p>}
    </Accordion>
  );
}
