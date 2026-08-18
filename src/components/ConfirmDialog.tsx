interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        data-testid="confirm-dialog"
        className="w-full max-w-sm rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-1)] px-5 py-4 shadow-2xl"
      >
        <h2 id="confirm-dialog-title" className="font-[var(--font-display)] text-base font-semibold text-[var(--color-ink)]">
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-dim)]">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-[var(--color-danger)] px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
