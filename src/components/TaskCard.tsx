import { Draggable } from '@hello-pangea/dnd';
import type { Task, ColumnConfig } from '../types';

interface TaskCardProps {
  task: Task;
  index: number;
  column: ColumnConfig;
  ticketNumber: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, index, column, ticketNumber, onEdit, onDelete }: TaskCardProps) {
  const ticketId = `${column.code}-${String(ticketNumber).padStart(3, '0')}`;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-testid={`task-card-${task.id}`}
          className={[
            'group relative flex overflow-hidden rounded-lg border bg-[var(--color-surface-2)]',
            'transition-shadow',
            snapshot.isDragging
              ? 'border-[var(--color-line-strong)] shadow-2xl shadow-black/50'
              : 'border-[var(--color-line)] shadow-sm hover:border-[var(--color-line-strong)]',
          ].join(' ')}
          style={provided.draggableProps.style}
        >
          <div
            className="perforation w-7 shrink-0 flex items-center justify-center"
            style={{ backgroundColor: column.dimVar }}
            aria-hidden="true"
          >
            <span
              className="font-mono text-[10px] tracking-tight text-[var(--color-ink)] rotate-180"
              style={{ writingMode: 'vertical-rl' }}
            >
              {ticketId}
            </span>
          </div>

          <div className="flex-1 min-w-0 p-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-medium leading-snug text-[var(--color-ink)] break-words">
                {task.title}
              </h3>
              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <button
                  type="button"
                  aria-label={`Edit ${task.title}`}
                  onClick={() => onEdit(task)}
                  className="rounded p-1 text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${task.title}`}
                  onClick={() => onDelete(task)}
                  className="rounded p-1 text-[var(--color-ink-dim)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  </svg>
                </button>
              </div>
            </div>
            {task.description && (
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-dim)] break-words line-clamp-3">
                {task.description}
              </p>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
