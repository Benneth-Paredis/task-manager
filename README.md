# Task Manager

A responsive Kanban-style task manager built with React, TypeScript, and Redux Toolkit. Manage tasks across three stages: Pending, In Progress, and Complete with drag-and-drop support, persistent storage, and real-time cross-tab synchronization.

## Running Locally

```bash
git clone https://github.com/Benneth-Paredis/task-manager.git
cd task-manager
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Time Spent

Approximately 3 hours.

## Implementation

### Architecture

The app uses a flat task array in a Redux Toolkit store, with each task holding a `stage` and `order` field. Columns are derived by filtering on `stage` and sorting by `order`. This keeps state management simple, changing a task's stage is a single field update rather than splicing between arrays.

### Components

- **Board** — The smart component. Connects to Redux, manages modal/dialog state, and handles all drag-and-drop events. Only component that dispatches actions.
- **Column** — Renders a droppable zone with a sorted list of task cards. Receives data and callbacks via props.
- **TaskCard** — Displays task content with edit, delete, and stage-change controls. Draggable via @dnd-kit.
- **TaskModal** — Dual-purpose modal for adding and editing tasks. Uses local state for form inputs, reports back via `onSave` callback.
- **ConfirmDialog** — Simple confirmation prompt before task deletion.

### State Management

Redux Toolkit with a single `tasksSlice` containing reducers for add, edit, delete, stage change, reorder, and full state replacement. A custom middleware persists state to localStorage after every action.

### Edge Case Handling

- **Empty titles**: Blocked by input validation and a disabled submit button.
- **Long descriptions**: Handled with `word-break: break-word` to prevent layout overflow.
- **Rapid task movements**: Safe because Redux processes actions synchronously, each dispatch sees the latest state.

## Bonus Points Covered

- **Drag and drop**: Implemented with @dnd-kit. Supports reordering within columns and moving tasks between stages.
- **LocalStorage persistence**: A Redux middleware saves state after every action. State is hydrated on startup via `preloadedState`.
- **Cross-tab sync**: Listens for `StorageEvent` on the window. Changes in one tab are reflected in all other open tabs instantly.

## Tech Stack

- React 18 + TypeScript
- Vite
- Redux Toolkit
- @dnd-kit (drag and drop)
- CSS (no framework)

## Design

The UI follows a glassmorphism design language with a gradient backdrop and translucent card surfaces, creating a layered, modern feel. 

## 