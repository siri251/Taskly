import { useEffect, useRef, useState } from 'react';
import { COLUMNS } from '../types';
import type { Task, TaskStatus } from '../types';

export interface TaskModalSubmit {
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskModalProps {
  mode: 'add' | 'edit';
  initialStatus: TaskStatus;
  task?: Task;
  onClose: () => void;
  onSubmit: (values: TaskModalSubmit) => void;
}

export function TaskModal({ mode, initialStatus, task, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? initialStatus);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Give this ticket a title before filing it.');
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), status });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        data-testid="task-form"
        className="w-full max-w-md rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-1)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
          <h2
            id="task-modal-title"
            className="font-[var(--font-display)] text-base font-semibold text-[var(--color-ink)]"
          >
            {mode === 'add' ? 'File new ticket' : 'Edit ticket'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-title" className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-dim)]">
              Title
            </label>
            <input
              id="task-title"
              ref={titleRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              maxLength={120}
              className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-progress)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-description" className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-dim)]">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              className="resize-none rounded-md border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-progress)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-dim)]">Platform</span>
            <div className="flex gap-2">
              {COLUMNS.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setStatus(col.id)}
                  aria-pressed={status === col.id}
                  className={[
                    'flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors',
                    status === col.id
                      ? 'border-transparent text-[var(--color-surface-0)]'
                      : 'border-[var(--color-line)] text-[var(--color-ink-dim)] hover:border-[var(--color-line-strong)]',
                  ].join(' ')}
                  style={status === col.id ? { backgroundColor: col.accentVar } : undefined}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-xs text-[var(--color-danger)]">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-[var(--color-line)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-[var(--color-progress)] px-4 py-1.5 text-sm font-semibold text-white hover:brightness-110"
          >
            {mode === 'add' ? 'Add ticket' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
