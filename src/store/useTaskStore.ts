import { create } from 'zustand';
import type { Task, TaskStatus } from '../types';

export interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
}

interface TaskState {
  tasksById: Record<string, Task>;
  columns: Record<TaskStatus, string[]>;
}

interface TaskActions {
  addTask: (input: TaskInput) => string;
  updateTask: (id: string, updates: Partial<TaskInput>) => void;
  deleteTask: (id: string) => void;
  moveTask: (
    taskId: string,
    source: { status: TaskStatus; index: number },
    destination: { status: TaskStatus; index: number }
  ) => void;
  reset: () => void;
}

export type TaskStore = TaskState & TaskActions;

const genId = (): string =>
  `t-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const emptyColumns = (): Record<TaskStatus, string[]> => ({
  todo: [],
  inprogress: [],
  done: [],
});

const initialState = (): TaskState => ({
  tasksById: {},
  columns: emptyColumns(),
});

const seedTasks = (): TaskState => {
  const seeds: TaskInput[] = [
    { title: 'Sketch onboarding flow', description: 'Rough wireframes for the first-run experience.', status: 'todo' },
    { title: 'Set up CI pipeline', description: 'Lint, typecheck, and test on every push.', status: 'todo' },
    { title: 'Build drag-and-drop board', description: 'Wire up columns with @hello-pangea/dnd.', status: 'inprogress' },
    { title: 'Design ticket-stub cards', description: '', status: 'done' },
  ];
  const tasksById: Record<string, Task> = {};
  const columns = emptyColumns();
  for (const seed of seeds) {
    const id = genId();
    tasksById[id] = { id, ...seed, createdAt: Date.now() };
    columns[seed.status].push(id);
  }
  return { tasksById, columns };
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  ...seedTasks(),

  addTask: ({ title, description, status }) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new Error('Task title cannot be empty');
    }
    const id = genId();
    const task: Task = {
      id,
      title: trimmedTitle,
      description: description.trim(),
      status,
      createdAt: Date.now(),
    };
    set((state) => ({
      tasksById: { ...state.tasksById, [id]: task },
      columns: {
        ...state.columns,
        [status]: [id, ...state.columns[status]],
      },
    }));
    return id;
  },

  updateTask: (id, updates) => {
    const existing = get().tasksById[id];
    if (!existing) return;

    const nextTitle = updates.title !== undefined ? updates.title.trim() : existing.title;
    if (!nextTitle) {
      throw new Error('Task title cannot be empty');
    }

    const statusChanged = updates.status !== undefined && updates.status !== existing.status;

    set((state) => {
      const updatedTask: Task = {
        ...existing,
        title: nextTitle,
        description: updates.description !== undefined ? updates.description.trim() : existing.description,
        status: updates.status ?? existing.status,
      };

      let columns = state.columns;
      if (statusChanged) {
        const fromStatus = existing.status;
        const toStatus = updatedTask.status;
        columns = {
          ...state.columns,
          [fromStatus]: state.columns[fromStatus].filter((taskId) => taskId !== id),
          [toStatus]: [id, ...state.columns[toStatus]],
        };
      }

      return {
        tasksById: { ...state.tasksById, [id]: updatedTask },
        columns,
      };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const task = state.tasksById[id];
      if (!task) return state;
      const { [id]: _removed, ...rest } = state.tasksById;
      return {
        tasksById: rest,
        columns: {
          ...state.columns,
          [task.status]: state.columns[task.status].filter((taskId) => taskId !== id),
        },
      };
    });
  },

  moveTask: (taskId, source, destination) => {
    set((state) => {
      const task = state.tasksById[taskId];
      if (!task) return state;

      const sourceIds = [...state.columns[source.status]];
      const sameColumn = source.status === destination.status;
      const destIds = sameColumn ? sourceIds : [...state.columns[destination.status]];

      const currentIndex = sourceIds.indexOf(taskId);
      if (currentIndex === -1) return state;
      sourceIds.splice(currentIndex, 1);

      const insertAt = Math.max(0, Math.min(destination.index, destIds.length));
      destIds.splice(insertAt, 0, taskId);

      const nextColumns = {
        ...state.columns,
        [source.status]: sameColumn ? destIds : sourceIds,
        [destination.status]: destIds,
      };

      const nextTasksById =
        task.status === destination.status
          ? state.tasksById
          : { ...state.tasksById, [taskId]: { ...task, status: destination.status } };

      return {
        tasksById: nextTasksById,
        columns: nextColumns,
      };
    });
  },

  reset: () => set(initialState()),
}));
