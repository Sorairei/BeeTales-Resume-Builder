import { useState } from "react";
import { DatabaseBackup, Download, ShieldCheck, Trash2, Upload } from "lucide-react";
import type { TranslationKey, Translator } from "../../data/translations";
import { Accordion } from "./Accordion";

interface Props {
  exportBackup: () => Promise<void>;
  importBackup: (file: File) => Promise<void>;
  deleteAllData: () => Promise<void>;
  t: Translator;
}

type MessageKey = "backupExported" | "backupImported" | "allDataDeleted" | "exportFailed" | "invalidJson" | "invalidStructure" | "incompatibleVersion" | "backupTooLarge";

function errorMessage(error: unknown): MessageKey {
  const code = error instanceof Error ? error.message : "";
  if (code === "invalid-json") return "invalidJson";
  if (["invalid-structure", "invalid-version", "invalid-photo"].includes(code)) return "invalidStructure";
  if (code === "incompatible-version") return "incompatibleVersion";
  if (code === "file-too-large") return "backupTooLarge";
  return "exportFailed";
}

export function DataActionsPanel({ exportBackup, importBackup, deleteAllData, t }: Props) {
  const [message, setMessage] = useState<MessageKey>();
  const [busy, setBusy] = useState(false);

  const runExport = async () => {
    setBusy(true); setMessage(undefined);
    try { await exportBackup(); setMessage("backupExported"); }
    catch (error) { setMessage(errorMessage(error)); }
    finally { setBusy(false); }
  };

  const runImport = async (file: File) => {
    if (!window.confirm(t("importBackupConfirm"))) return;
    setBusy(true); setMessage(undefined);
    try { await importBackup(file); setMessage("backupImported"); }
    catch (error) { setMessage(errorMessage(error)); }
    finally { setBusy(false); }
  };

  const runDelete = async () => {
    if (!window.confirm(t("deleteAllConfirm"))) return;
    setBusy(true); setMessage(undefined);
    try { await deleteAllData(); setMessage("allDataDeleted"); }
    catch { setMessage("exportFailed"); }
    finally { setBusy(false); }
  };

  return <Accordion title={t("dataAndBackups")} description={t("dataAndBackupsHelp")} icon={<DatabaseBackup size={18} />} badge={t("savedLocally")}>
    <div className="data-actions-intro"><ShieldCheck size={17} /><p><strong>{t("backupPrivacyTitle")}</strong>{t("backupPrivacyBody")}</p></div>
    <div className="data-action-grid">
      <button type="button" onClick={() => void runExport()} disabled={busy}><Download size={17} /><span><strong>{t("exportJson")}</strong><small>{t("exportJsonHelp")}</small></span></button>
      <label className={busy ? "disabled" : ""}><Upload size={17} /><span><strong>{t("importJson")}</strong><small>{t("importJsonHelp")}</small></span><input type="file" accept="application/json,.json" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void runImport(file); event.target.value = ""; }} /></label>
    </div>
    <button type="button" className="delete-all-data" disabled={busy} onClick={() => void runDelete()}><Trash2 size={16} />{t("deleteAllData")}</button>
    {message && <p className={`data-action-message ${["backupExported", "backupImported", "allDataDeleted"].includes(message) ? "success" : "error"}`} role="status">{t(message as TranslationKey)}</p>}
  </Accordion>;
}
