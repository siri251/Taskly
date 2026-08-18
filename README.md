# Dispatch — Kanban Task Board

A three-column (To Do / In Progress / Done) kanban dashboard with drag-and-drop,
built with React + TypeScript, Zustand, Tailwind CSS v4, and `@hello-pangea/dnd`.

## Features

- Add, edit, and delete tasks (title + optional description + status)
- Drag and drop tasks between columns, and reorder within a column
- Zustand store for state management, kept as small pure actions so it's easy
  to unit test independent of React
- Delete confirmation dialog to avoid accidental data loss

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Project structure

```
src/
  types.ts                  Task/column types + column config
  store/useTaskStore.ts     Zustand store: addTask, updateTask, deleteTask, moveTask
  components/
    Board.tsx               Top-level layout, DragDropContext, modal wiring
    Column.tsx              Droppable column
    TaskCard.tsx            Draggable task card
    TaskModal.tsx           Add/edit form
    ConfirmDialog.tsx       Delete confirmation
```

## Notes for testing

- `useTaskStore` is a plain Zustand store (no React needed to exercise it), so
  unit tests can import `useTaskStore.getState()` / `.setState()` directly.
- Interactive elements carry `data-testid` attributes (`new-task-button`,
  `task-form`, `task-card-<id>`, `column-<status>`, `confirm-dialog`) to make
  them easy to target from Testing Library / Playwright.
- `moveTask(taskId, source, destination)` takes plain `{status, index}` objects
  mirroring `@hello-pangea/dnd`'s `DropResult`, so drag-and-drop logic can be
  unit tested without simulating real pointer events.
