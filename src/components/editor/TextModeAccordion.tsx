import { lazy, Suspense, type Dispatch, type SetStateAction } from "react";
import { CodeXml } from "lucide-react";
import type { Translator } from "../../data/translations";
import type { ResumeData } from "../../types/resume";
import { Accordion } from "./Accordion";

const TextModeContent = lazy(() => import("./TextModePanel").then((module) => ({ default: module.TextModeContent })));

interface Props {
  resume: ResumeData;
  setResume: Dispatch<SetStateAction<ResumeData>>;
  t: Translator;
}

export function TextModeAccordion({ resume, setResume, t }: Props) {
  return <Accordion title={t("textMode")} description={t("textModeHelp")} icon={<CodeXml size={18} />} badge={t("textModeBadge")} defer>
    <Suspense fallback={<p className="text-mode-loading">{t("textModeHelp")}</p>}>
      <TextModeContent resume={resume} setResume={setResume} t={t} />
    </Suspense>
  </Accordion>;
}
