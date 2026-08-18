import { useMemo, useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useTaskStore } from '../store/useTaskStore';
import { COLUMNS } from '../types';
import type { Task, TaskStatus } from '../types';
import { Column } from './Column';
import { TaskModal } from './TaskModal';
import type { TaskModalSubmit } from './TaskModal';
import { ConfirmDialog } from './ConfirmDialog';

type ModalState = { mode: 'add'; status: TaskStatus } | { mode: 'edit'; task: Task } | null;

export function Board() {
  const tasksById = useTaskStore((s) => s.tasksById);
  const columns = useTaskStore((s) => s.columns);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const moveTask = useTaskStore((s) => s.moveTask);

  const [modal, setModal] = useState<ModalState>(null);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const tasksByColumn = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { todo: [], inprogress: [], done: [] };
    for (const col of COLUMNS) {
      map[col.id] = columns[col.id].map((id) => tasksById[id]).filter(Boolean);
    }
    return map;
  }, [columns, tasksById]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    moveTask(
      draggableId,
      { status: source.droppableId as TaskStatus, index: source.index },
      { status: destination.droppableId as TaskStatus, index: destination.index }
    );
  };

  const handleModalSubmit = (values: TaskModalSubmit) => {
    if (modal?.mode === 'edit') {
      updateTask(modal.task.id, values);
    } else {
      addTask(values);
    }
    setModal(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-bold tracking-tight text-[var(--color-ink)]">
            Taskly
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-ink-dim)]">Task control board</p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ mode: 'add', status: 'todo' })}
          data-testid="new-task-button"
          className="flex items-center gap-1.5 rounded-md bg-[var(--color-progress)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New ticket
        </button>
      </header>

      <div className="min-h-0 flex-1 px-6 pb-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid h-full min-h-0 grid-cols-1 gap-4 md:grid-cols-3">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                column={col}
                tasks={tasksByColumn[col.id]}
                onAddClick={(status) => setModal({ mode: 'add', status })}
                onEdit={(task) => setModal({ mode: 'edit', task })}
                onDelete={(task) => setPendingDelete(task)}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {modal && (
        <TaskModal
          mode={modal.mode}
          initialStatus={modal.mode === 'add' ? modal.status : modal.task.status}
          task={modal.mode === 'edit' ? modal.task : undefined}
          onClose={() => setModal(null)}
          onSubmit={handleModalSubmit}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete ticket?"
          message={`"${pendingDelete.title}" will be permanently removed from the board.`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => {
            deleteTask(pendingDelete.id);
            setPendingDelete(null);
          }}
        />
      )}
    </div>
  );
}
