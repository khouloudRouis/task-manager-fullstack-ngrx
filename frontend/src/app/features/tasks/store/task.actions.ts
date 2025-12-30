import { createAction, props } from '@ngrx/store';
import { Task, TaskStatus } from '../../../core/models/task';

// Action naming convention: [Source] Event
export const loadTasks = createAction('[Tasks] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Tasks API] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks API] Load Tasks Failure',
  props<{ error: string }>()
);

export const updateTaskStatus = createAction(
  '[Tasks] Update Task Status',
  props<{ taskId: string; newStatus: TaskStatus; newOrder?: number }>()
);

export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ task: Task }>()
);

export const addTask = createAction(
  '[Tasks] Add Task',
  props<{ title: string; status: TaskStatus }>()
);

export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ taskId: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks API] Delete Task Success',
  props<{ taskId: string }>()
);

export const deleteTaskFailure = createAction(
  '[Tasks API] Delete Task Failure',
  props<{ error: string }>()
);

export const reorderTasks = createAction(
  '[Tasks] Reorder Tasks',
  props<{ taskIdsInOrder: string[]; status: TaskStatus }>()
);
