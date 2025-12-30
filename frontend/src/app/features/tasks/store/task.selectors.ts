import { TaskStatus } from "../../../core/models/task";
import { TasksState } from "./task.state";
import { createFeatureSelector, createSelector } from '@ngrx/store';


export const selectTasksState = createFeatureSelector<TasksState>('tasks');

export const selectAllTasks = createSelector(
    selectTasksState,
    (state: TasksState) => state.tasks
);

export const selectTasksLoading = createSelector(
    selectTasksState,
    (state: TasksState) => state.loading
);

export const selectTasksError = createSelector(
    selectTasksState,
    (state: TasksState) => state.error
);

export const selectTasksByStatus = (status: TaskStatus) => createSelector(
    selectAllTasks,
    (tasks) => tasks
        .filter(task => task.status === status)
        .sort((a, b) => a.order - b.order)
);