import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Clipboard, CodeXml, Download, FileUp, RefreshCw, Save } from "lucide-react";
import type { TranslationKey, Translator } from "../../data/translations";
import { downloadTextResume, parseTextResume, readTextResumeFile, serializeTextResume, type TextResumeFormat } from "../../services/textModeService";
import type { ResumeData } from "../../types/resume";

interface Props {
  resume: ResumeData;
  setResume: Dispatch<SetStateAction<ResumeData>>;
  t: Translator;
}

type TextStatus = "synced" | "pending" | "invalid" | "copied" | "downloaded" | "imported" | "too-large";

export function TextModeContent({ resume, setResume, t }: Props) {
  const [format, setFormat] = useState<TextResumeFormat>("yaml");
  const [draftOverride, setDraftOverride] = useState<string | null>(null);
  const [status, setStatus] = useState<TextStatus>("synced");
  const canonicalText = useMemo(() => serializeTextResume(resume, format), [format, resume]);
  const draft = draftOverride ?? canonicalText;

  useEffect(() => {
    if (draftOverride === null) return;
    const timer = window.setTimeout(() => {
      try {
        const parsed = parseTextResume(draftOverride, format, resume);
        setResume(parsed);
        setDraftOverride(null);
        setStatus("synced");
      } catch {
        setStatus("invalid");
      }
    }, 700);
    return () => window.clearTimeout(timer);
  }, [draftOverride, format, resume, setResume]);

  const changeFormat = (next: TextResumeFormat) => {
    setFormat(next);
    setDraftOverride(null);
    setStatus("synced");
  };

  const apply = () => {
    try {
      const parsed = parseTextResume(draft, format, resume);
      setResume(parsed);
      setDraftOverride(null);
      setStatus("synced");
    } catch {
      setStatus("invalid");
    }
  };

  const refresh = () => {
    setDraftOverride(null);
    setStatus("synced");
  };

  const importFile = async (file: File) => {
    if (!window.confirm(t("textImportConfirm"))) return;
    try {
      const importedFormat: TextResumeFormat = file.name.toLowerCase().endsWith(".md") ? "markdown" : "yaml";
      const content = await readTextResumeFile(file);
      const parsed = parseTextResume(content, importedFormat, resume);
      setFormat(importedFormat);
      setResume(parsed);
      setDraftOverride(null);
      setStatus("imported");
    } catch (error) {
      setStatus(error instanceof Error && error.message === "text-file-too-large" ? "too-large" : "invalid");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus("copied");
    } catch {
      setStatus("invalid");
    }
  };

  const statusKeys: Record<TextStatus, TranslationKey> = { synced: "textSynced", pending: "textPending", invalid: "textInvalid", copied: "textCopied", downloaded: "textDownloaded", imported: "textImported", "too-large": "textFileTooLarge" };

  return <>
    <div className="text-mode-intro"><CodeXml size={18} /><p><strong>{t("textSyncTitle")}</strong>{t(format === "markdown" ? "textMarkdownHelp" : "textSyncHelp")}</p></div>
    <div className="text-mode-toolbar">
      <label className="field"><span>{t("textFormat")}</span><select value={format} onChange={(event) => changeFormat(event.target.value as TextResumeFormat)}><option value="yaml">{t("yamlFormat")}</option><option value="markdown">{t("markdownFormat")}</option></select></label>
      <span className={`text-sync-status status-${status}`} role="status" aria-live="polite">{t(statusKeys[status])}</span>
    </div>
    <label className="text-editor-field"><span className="sr-only">{t("textEditorLabel")}</span><textarea value={draft} onChange={(event) => { setDraftOverride(event.target.value); setStatus("pending"); }} spellCheck={false} aria-label={t("textEditorLabel")} /></label>
    <div className="text-mode-actions">
      <button type="button" onClick={apply}><Save size={15} />{t("textApply")}</button>
      <button type="button" onClick={refresh}><RefreshCw size={15} />{t("textRefresh")}</button>
      <button type="button" onClick={() => void copy()}><Clipboard size={15} />{t("textCopy")}</button>
      <button type="button" onClick={() => { downloadTextResume(draft, format, resume.personal.fullName); setStatus("downloaded"); }}><Download size={15} />{t("textDownload")}</button>
      <label><FileUp size={15} />{t("textImport")}<input type="file" accept=".yaml,.yml,.md,text/yaml,application/yaml,text/markdown" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importFile(file); event.target.value = ""; }} /></label>
    </div>
  </>;
}
