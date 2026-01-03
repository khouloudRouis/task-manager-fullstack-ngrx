import { createAction, props } from '@ngrx/store';
import { Task } from '../../../core/models/task';


export const loadTasks = createAction('[Tasks] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Tasks API] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks API] Load Tasks Failure',
  props<{ error: string }>()
);


export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ task: Task }>()
);
export const updateTaskSuccess = createAction(
  '[Tasks API] Update Task Success',
  props<{ task: Task }>()
);
export const updateTaskFailure = createAction(
  '[Tasks API] Update Task Failure',
  props<{ taskId: string; error: string }>()
);

export const addTask = createAction(
  '[Tasks] Add Task',
  props<{ task: Task }>()
);

export const addTaskSuccess = createAction(
  '[Tasks API] Add Task Success',
  props<{ taskId: string }>()
);
export const addTaskFailure = createAction(
  '[Tasks API] Add Task Failure',
  props<{ error: string }>()
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
  props<{ taskId: string; error: string }>()
);

