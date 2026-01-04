import { createReducer, on } from '@ngrx/store';
import { initialTasksState } from './task.state';
import { addTask, deleteTask, loadTasks, loadTasksSuccess, loadTasksFailure, updateTask, addTaskSuccess, addTaskFailure, updateTaskFailure, updateTaskSuccess, deleteTaskSuccess, deleteTaskFailure } from './task.actions';

/**
 * Task Reducer with Optimistic Updates and Rollback Pattern
 * 
 * This reducer implements optimistic updates for better UX:
 * 1. When update/delete is dispatched, UI updates immediately (optimistic)
 * 2. Previous state is stored for potential rollback
 * 3. On success: cleanup stored previous state
 * 4. On failure: rollback to previous state
 */
export const taskReducer = createReducer(
    initialTasksState,
    on(loadTasks, (state) => ({
        ...state,
        loading: true,
        error: null
    })),

    on(loadTasksSuccess, (state, { tasks }) => ({
        ...state,
        tasks,
        loading: false,
    })),

    on(loadTasksFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(addTask, (state, { task }) => {
        return { ...state,
             tasks: [...state.tasks, task],
            loading: true,
            error: null };
    }),

    on(addTaskSuccess, (state, { taskId }) => {
        return {
            ...state,
            tasks: state.tasks.map(t => !t.id ? { ...t, id: taskId } : t),
            loading: false,
        };
    }),

    on(addTaskFailure, (state, { error }) => {
        return {
            ...state,
            tasks: state.tasks.filter(t => t.id),
            loading: false,
            error
        };
    }),

    on(updateTask, (state, { task }) => {
        const previousTask = state.tasks.find(t => t.id === task.id);

        return {
            ...state,
            tasks: state.tasks.map(t => t.id === task.id ? task : t),
            previousTasks: previousTask
                ? { ...state.previousTasks, [task.id]: previousTask }
                : state.previousTasks,
            loading: true,
            error : null
        };
    }),

    on(updateTaskSuccess, (state, { task }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [task.id]: _removed, ...remainingPreviousTasks } = state.previousTasks;

        return {
            ...state,
            tasks: state.tasks.map(t => t.id === task.id ? { ...t, ...task } : t),
            previousTasks: remainingPreviousTasks,
            error: null
        };
    }),

    on(updateTaskFailure, (state, { taskId, error }) => {
        const previousTask = state.previousTasks[taskId];
        if (!previousTask) {
            return { ...state, error };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [taskId]: _removed, ...remainingPreviousTasks } = state.previousTasks;

        return {
            ...state,
            tasks: state.tasks.map(t => t.id === taskId ? previousTask : t),
            previousTasks: remainingPreviousTasks,
            error
        };
    }),

    on(deleteTask, (state, { taskId }) => {
        const previousTask = state.tasks.find(task => task.id === taskId);
        return {
            ...state,
            tasks: state.tasks.filter(task => task.id !== taskId),
            previousTasks: previousTask
                ? { ...state.previousTasks, [taskId]: previousTask }
                : state.previousTasks
        };
    }),

    on(deleteTaskSuccess, (state, { taskId }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [taskId]: _removed, ...remainingPreviousTasks } = state.previousTasks;
        return {
            ...state,
            previousTasks: remainingPreviousTasks,
            error: null
        };
    }),

    on(deleteTaskFailure, (state, { taskId, error }) => {
        const previousTask = state.previousTasks[taskId];
        if (!previousTask) {
            return { ...state, error };
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [taskId]: _removed, ...remainingPreviousTasks } = state.previousTasks;

        return {
            ...state,
            tasks: [...state.tasks, previousTask],
            previousTasks: remainingPreviousTasks,
            error
        };
    }),
);
