import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, Stage } from '../types';

interface TaskCardProps {
  task: Task;
  fullStages: Set<Stage>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStageChange: (id: string, newStage: Stage) => void;
}

const NEXT_STAGE: Record<Stage, Stage | null> = {
  'pending': 'in-progress',
  'in-progress': 'complete',
  'complete': null,
};

const PREV_STAGE: Record<Stage, Stage | null> = {
  'pending': null,
  'in-progress': 'pending',
  'complete': 'in-progress',
};

const TaskCard = ({ task, fullStages, onEdit, onDelete, onStageChange }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const prevStage = PREV_STAGE[task.stage];
  const nextStage = NEXT_STAGE[task.stage];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-actions">
        {prevStage && (
          <button
            disabled={fullStages.has(prevStage)}
            onClick={() => onStageChange(task.id, prevStage)}
          >←</button>
        )}
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task.id)}>Delete</button>
        {nextStage && (
          <button
            disabled={fullStages.has(nextStage)}
            onClick={() => onStageChange(task.id, nextStage)}
          >→</button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
