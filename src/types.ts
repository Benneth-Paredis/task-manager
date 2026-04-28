export type Stage = 'pending' | 'in-progress' | 'complete';

export interface Task {
  id: string;
  title: string;
  description: string;
  stage: Stage;
  // Sort position in column
  order: number;
}