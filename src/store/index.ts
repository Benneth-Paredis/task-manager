import { configureStore } from '@reduxjs/toolkit';
import type { Middleware } from 'redux';
import tasksReducer from './tasksSlice';

const STORAGE_KEY = 'task-manager-tasks';

const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);
  const state = store.getState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks.tasks));
  return result;
};

const loadTasks = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
  preloadedState: {
    tasks: { tasks: loadTasks() },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;