import { useState, useEffect } from 'react';
import type { Task } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  task: Task | null;  // null = adding, Task = editing
  onSave: (title: string, description: string) => void;
  onClose: () => void;
}

const TaskModal = ({ isOpen, task, onSave, onClose }: TaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) return;  // edge case: empty title
    onSave(title.trim(), description.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{task ? 'Edit Task' : 'Add Task'}</h2>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={!title.trim()}>
            {task ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;