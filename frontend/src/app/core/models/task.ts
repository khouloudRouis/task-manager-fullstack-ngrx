export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  order: number;
  description: string;
  createdAt: string;
}
