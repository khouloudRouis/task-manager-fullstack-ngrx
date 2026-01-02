import { Task } from "../../core/models/task";

export class TaskUtils {
    
  /** Get the last task in a list, or undefined if empty */
  static lastTask(tasks: Task[]): Task | undefined {
    return tasks.length ? tasks[tasks.length - 1] : undefined;
  }

  /** Calculate fractional order for drag-drop or insertion */
  static calculateOrder(prev?: Task, next?: Task): number {
    if (!prev && !next) return 100;
    if (!prev) return next!.order - 100;
    if (!next) return prev.order + 100;
    const newOrder = (prev.order + next.order) / 2;
    return Math.round(newOrder );
  }
}
