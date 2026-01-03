import { Task } from "../../../core/models/task";


export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  previousTasks: Record<string, Task>;
}
export const initialTasksState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  previousTasks: {}
};