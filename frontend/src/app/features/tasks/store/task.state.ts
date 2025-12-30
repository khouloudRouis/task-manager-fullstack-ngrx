import { Task } from "../../../core/models/task";


export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
