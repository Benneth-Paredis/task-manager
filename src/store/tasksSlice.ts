import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Stage } from '../types';

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [
    { id: uuidv4(), title: 'Design mockups', description: 'Create wireframes for the new dashboard', stage: 'pending', order: 0 },
    { id: uuidv4(), title: 'Set up CI/CD', description: 'Configure GitHub Actions pipeline', stage: 'pending', order: 1 },
    { id: uuidv4(), title: 'Build API', description: 'Implement REST endpoints for tasks', stage: 'in-progress', order: 0 },
    { id: uuidv4(), title: 'Write tests', description: 'Add unit tests for the task slice', stage: 'in-progress', order: 1 },
    { id: uuidv4(), title: 'Deploy to staging', description: 'Push latest build to staging environment', stage: 'complete', order: 0 },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<{ title: string; description: string }>) {
      const tasksInPending = state.tasks.filter(t => t.stage === 'pending');
      state.tasks.push({
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description,
        stage: 'pending',
        order: tasksInPending.length,
      });
    },

    editTask(state, action: PayloadAction<{ id: string; title: string; description: string }>) {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
        task.description = action.payload.description;
      }
    },

    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },

    changeStage(state, action: PayloadAction<{ id: string; newStage: Stage }>) {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        const tasksInNewStage = state.tasks.filter(t => t.stage === action.payload.newStage);
        task.stage = action.payload.newStage;
        task.order = tasksInNewStage.length; // place at end of new column
      }
    },

    reorderTask(state, action: PayloadAction<{ stage: Stage; oldIndex: number; newIndex: number }>) {
      const { stage, oldIndex, newIndex } = action.payload;
      const columnTasks = state.tasks
        .filter(t => t.stage === stage)
        .sort((a, b) => a.order - b.order);

      const [moved] = columnTasks.splice(oldIndex, 1);
      columnTasks.splice(newIndex, 0, moved);

      // reassign order values
      columnTasks.forEach((task, index) => {
        const original = state.tasks.find(t => t.id === task.id);
        if (original) original.order = index;
      });
    },

    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
  },
});

export const { addTask, editTask, deleteTask, changeStage, reorderTask, setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;