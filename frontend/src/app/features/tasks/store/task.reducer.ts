import { createReducer, on } from '@ngrx/store';
import { initialTasksState } from './task.state';
import { addTask, deleteTask, loadTasks, loadTasksSuccess, loadTasksFailure, updateTask, addTaskSuccess, addTaskFailure, updateTaskFailure, updateTaskSuccess, deleteTaskSuccess, deleteTaskFailure } from './task.actions';
import { Task } from '../../../core/models/task';
let previousTask: Task | undefined;
export const taskReducer = createReducer(

    initialTasksState,
    on(loadTasks, (state) => ({
        ...state,
        loading: true
    })),

    on(loadTasksSuccess, (state, { tasks }) => ({
        ...state,
        tasks
    })),

    on(loadTasksFailure, (state, { error }) => ({
        ...state,
        error
    })),

    on(addTask, (state, { task }) => {
        return { ...state, tasks: [...state.tasks, task] };
    }),

    on(addTaskSuccess, (state, { taskId }) => {
        return { ...state, tasks: state.tasks.map(t => !t.id ? { ...t, id: taskId } : t) };
    }),

    on(addTaskFailure, (state, { error }) => ({
        ...state,
        tasks: state.tasks.filter(t => !t.id),
        error
    })),

    on(updateTask, (state, { task }) => {
        previousTask = state.tasks.find(t => t.id === task.id);
        return {
            ...state,
            tasks: state.tasks.map(t => t.id === task.id ? task : t)
        };
    }),

    on(updateTaskSuccess, (state, { task }) => {
        const updatedTasks = state.tasks.map(t =>
            t.id === task.id ? { ...t, ...task } : t
        );
        return { ...state, tasks: updatedTasks };
    }),


    on(updateTaskFailure, (state, { error }) => ({
        ...state,
        tasks: state.tasks.map(t => t.id === previousTask?.id ? previousTask : t),
         error
    })),
    on(deleteTask, (state, { taskId }) => {
        previousTask = state.tasks.find(task => task.id === taskId);
        return { ...state, tasks: state.tasks.filter(task => task.id !== taskId) };
    }),

    on(deleteTaskSuccess, (state) => ({
        ...state
    })),

    on(deleteTaskFailure, (state, { error }) => ({
        ...state,
        tasks: [...state.tasks, previousTask!],
        error
    })),
);