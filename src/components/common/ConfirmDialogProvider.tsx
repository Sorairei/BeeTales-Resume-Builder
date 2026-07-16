import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CircleHelp, TriangleAlert, X } from "lucide-react";
import { ConfirmDialogContext, type ConfirmDialogOptions, type ConfirmDialogRequest } from "../../contexts/confirmDialog";

interface PendingDialog extends ConfirmDialogOptions {
  id: number;
}

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<PendingDialog>();
  const resolverRef = useRef<(accepted: boolean) => void>(undefined);
  const sequenceRef = useRef(0);

  const finish = useCallback((accepted: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = undefined;
    setDialog(undefined);
    resolve?.(accepted);
  }, []);

  const confirm = useCallback<ConfirmDialogRequest>((options) => new Promise<boolean>((resolve) => {
    resolverRef.current?.(false);
    resolverRef.current = resolve;
    sequenceRef.current += 1;
    setDialog({ ...options, id: sequenceRef.current });
  }), []);

  useEffect(() => () => resolverRef.current?.(false), []);

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {dialog && <ConfirmDialog key={dialog.id} options={dialog} onFinish={finish} />}
    </ConfirmDialogContext.Provider>
  );
}

function ConfirmDialog({ options, onFinish }: { options: PendingDialog; onFinish: (accepted: boolean) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const danger = options.tone === "danger";

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    const restoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    element.showModal();
    cancelButtonRef.current?.focus();
    return () => {
      if (element.open) element.close();
      queueMicrotask(() => { if (restoreFocus?.isConnected) restoreFocus.focus(); });
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`confirm-dialog ${danger ? "danger" : "default"}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => { event.preventDefault(); onFinish(false); }}
      onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); onFinish(false); } }}
      onClick={(event) => { if (event.target === event.currentTarget) onFinish(false); }}
    >
      <div className="confirm-dialog-card">
        <div className="confirm-dialog-heading">
          <span className="confirm-dialog-icon" aria-hidden="true">{danger ? <TriangleAlert size={20} /> : <CircleHelp size={20} />}</span>
          <div><span className="confirm-dialog-kicker">BeeTales</span><h2 id={titleId}>{options.title}</h2></div>
          <button type="button" className="confirm-dialog-close" onClick={() => onFinish(false)} aria-label={options.closeLabel}><X size={18} /></button>
        </div>
        <p id={descriptionId} className="confirm-dialog-message">{options.message}</p>
        <div className="confirm-dialog-actions">
          <button ref={cancelButtonRef} type="button" className="confirm-dialog-cancel" onClick={() => onFinish(false)}>{options.cancelLabel}</button>
          <button type="button" className="confirm-dialog-accept" onClick={() => onFinish(true)}>{options.confirmLabel}</button>
        </div>
      </div>
    </dialog>
  );
}
