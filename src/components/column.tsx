import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Stage, Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  stage: Stage;
  title: string;
  tasks: Task[];
  fullStages: Set<Stage>;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStageChange: (id: string, newStage: Stage) => void;
}

const Column = ({ stage, title, tasks, fullStages, onEdit, onDelete, onStageChange }: ColumnProps) => {
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  const { setNodeRef } = useDroppable({ id: stage });

  return (
    <div className="column" ref={setNodeRef}>
      <h2>{title}</h2>
      <SortableContext items={sortedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="task-list">
          {sortedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              fullStages={fullStages}
              onEdit={onEdit}
              onDelete={onDelete}
              onStageChange={onStageChange}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
