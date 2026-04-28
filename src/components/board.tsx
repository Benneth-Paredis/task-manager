import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addTask, editTask, deleteTask, changeStage, reorderTask } from '../store/tasksSlice';
import type { Stage, Task } from '../types';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import ConfirmDialog from './ConfirmDialog';

const COLUMN_LIMIT = 6;

const columns: { stage: Stage; title: string }[] = [
  { stage: 'pending', title: 'Pending' },
  { stage: 'in-progress', title: 'In Progress' },
  { stage: 'complete', title: 'Complete' },
];

const STAGES: Stage[] = ['pending', 'in-progress', 'complete'];

const Board = () => {
  const tasks = useAppSelector(state => state.tasks.tasks);
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const countByStage = (stage: Stage) => tasks.filter(t => t.stage === stage).length;

  const fullStages = new Set<Stage>(STAGES.filter(s => countByStage(s) >= COLUMN_LIMIT));

  const findTaskStage = (id: string): Stage | undefined =>
    tasks.find(t => t.id === id)?.stage;

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeStage = findTaskStage(activeId);
    const overStage = STAGES.includes(overId as Stage)
      ? (overId as Stage)
      : findTaskStage(overId);

    if (!activeStage || !overStage || activeStage === overStage) return;
    if (fullStages.has(overStage)) return;

    dispatch(changeStage({ id: activeId, newStage: overStage }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeStage = findTaskStage(activeId);

    if (STAGES.includes(overId as Stage)) return;

    const overStage = findTaskStage(overId);

    if (!activeStage || !overStage || activeStage !== overStage) return;

    const columnTasks = tasks
      .filter(t => t.stage === activeStage)
      .sort((a, b) => a.order - b.order);

    const oldIndex = columnTasks.findIndex(t => t.id === activeId);
    const newIndex = columnTasks.findIndex(t => t.id === overId);

    if (oldIndex !== newIndex) {
      dispatch(reorderTask({ stage: activeStage, oldIndex, newIndex }));
    }
    setActiveTask(null);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSave = (title: string, description: string) => {
    if (editingTask) {
      dispatch(editTask({ id: editingTask.id, title, description }));
    } else {
      if (fullStages.has('pending')) return;
      dispatch(addTask({ title, description }));
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteTask(deleteId));
      setDeleteId(null);
    }
  };

  const handleStageChange = (id: string, newStage: Stage) => {
    if (fullStages.has(newStage)) return;
    dispatch(changeStage({ id, newStage }));
  };

  return (
    <div>
      <button
        className="add-button"
        onClick={handleAdd}
        disabled={fullStages.has('pending')}
      >
        + Add Task
      </button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        autoScroll={false}
      >
        <div className="board">
          {columns.map(col => (
            <Column
              key={col.stage}
              stage={col.stage}
              title={col.title}
              tasks={tasks.filter(t => t.stage === col.stage)}
              fullStages={fullStages}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStageChange={handleStageChange}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              fullStages={fullStages}
              onEdit={() => {}}
              onDelete={() => {}}
              onStageChange={() => {}}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default Board;
