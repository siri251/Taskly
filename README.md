# Taskly — Kanban Task Board

A three-column - To Do / In Progress / Done kanban dashboard with drag-and-drop,
built with React + TypeScript, Zustand, Tailwind CSS v4

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

## Testing
 
### Unit tests (Jest) — `src/store/useTaskStore.test.ts`
- Creating a task places it under the correct column (To Do / In Progress / Done)
- Creating a task with an empty title throws a validation error
- Editing a task's title/description updates it without moving it
- Editing a task's status moves it into the new column
- Deleting a task removes it from state
- Moving a task across columns updates both its column and its status
Run: `npm test`
 
### Integration tests (Jest + React Testing Library) — `src/components/Board.integration.test.tsx`
- Creating a task through the UI form adds a visible card to the right column
- Submitting the add-task form with an empty title shows a validation error and blocks creation
- Editing a task's status through the modal visually moves the card to the new column
- Deleting a task only removes it after the confirmation dialog is accepted
Run: `npm test`
 
### End-to-end tests (Playwright) — `e2e/kanban.spec.ts`
- Full lifecycle: create → edit → delete a task through the real UI
- Drag-and-drop a card from one column to another
- Drag-and-drop to reorder cards within the same column
Run: `npm run test:e2e`
