export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: number;
}

export interface ColumnConfig {
  id: TaskStatus;
  title: string;
  accentVar: string;
  dimVar: string;
  code: string;
}

export const COLUMNS: ColumnConfig[] = [
  { id: 'todo', title: 'To Do', accentVar: 'var(--color-todo)', dimVar: 'var(--color-todo-dim)', code: 'TD' },
  { id: 'inprogress', title: 'In Progress', accentVar: 'var(--color-progress)', dimVar: 'var(--color-progress-dim)', code: 'IP' },
  { id: 'done', title: 'Done', accentVar: 'var(--color-done)', dimVar: 'var(--color-done-dim)', code: 'DN' },
];
