import { Droppable } from '@hello-pangea/dnd';
import type { ColumnConfig, Task } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  onAddClick: (status: ColumnConfig['id']) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function Column({ column, tasks, onAddClick, onEdit, onDelete }: ColumnProps) {
  return (
    <section
      className="flex h-full min-h-0 w-full flex-col rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-1)]"
      aria-label={`${column.title} column`}
    >
      <header
        className="flex items-center justify-between gap-2 rounded-t-xl border-b border-[var(--color-line)] px-4 py-3"
        style={{ borderTop: `3px solid ${column.accentVar}` }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: column.accentVar }} aria-hidden="true" />
          <h2 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wide text-[var(--color-ink)]">
            {column.title}
          </h2>
          <span className="rounded-full bg-[var(--color-surface-3)] px-2 py-0.5 font-mono text-[11px] text-[var(--color-ink-dim)]">
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onAddClick(column.id)}
          aria-label={`Add task to ${column.title}`}
          className="rounded-md p-1.5 text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-ink)]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </header>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            data-testid={`column-${column.id}`}
            className={[
              'scrollbar-thin flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-2 transition-colors',
              snapshot.isDraggingOver ? 'bg-[var(--color-surface-2)]/60' : '',
            ].join(' ')}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-[var(--color-line)] px-4 py-8 text-center text-xs text-[var(--color-ink-faint)]">
                No tickets on this platform yet
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                column={column}
                ticketNumber={index + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
