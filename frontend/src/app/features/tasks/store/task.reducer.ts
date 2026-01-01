import { createReducer, on } from '@ngrx/store';
import { initialTasksState } from './task.state';
import { addTask, deleteTask, loadTasks, loadTasksSuccess, loadTasksFailure, reorderTasks, updateTask, updateTaskStatus, addTaskSuccess, addTaskFailure, updateTaskFailure, updateTaskSuccess, deleteTaskSuccess, deleteTaskFailure } from './task.actions';
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
        console.log({ ...state, tasks: state.tasks.map(t => !t.id ? { ...t, id: taskId } : t) });
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
// TODO: Refactor reorder and update status to avoid code duplication
    on(updateTaskStatus, (state, { taskId, newStatus, newOrder }) => {
        const taskToMove = state.tasks.find(t => t.id === taskId);
        if (!taskToMove) return state;

        const oldStatus = taskToMove.status;

        // If moving to a different status, calculate new order
        let order = newOrder;
        if (order === undefined) {
            // If no order specified, place at the end of the new status list
            const tasksInNewStatus = state.tasks.filter(t => t.status === newStatus);
            order = tasksInNewStatus.length;
        }

        // Update the moved task
        const updatedTasks = state.tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, status: newStatus, order };
            }
            // If moving from old status, adjust orders of remaining tasks
            if (task.status === oldStatus && task.order > taskToMove.order) {
                return { ...task, order: task.order - 1 };
            }
            // If moving to new status, adjust orders of tasks after the insertion point
            if (task.status === newStatus && task.order >= order && task.id !== taskId) {
                return { ...task, order: task.order + 1 };
            }
            return task;
        });

        // Sort tasks by status and order
        const sortedTasks = updatedTasks.sort((a, b) => {
            if (a.status !== b.status) {
                return a.status.localeCompare(b.status);
            }
            return a.order - b.order;
        });

        return { ...state, tasks: sortedTasks };
    }),

    on(reorderTasks, (state, { taskIdsInOrder, status }) => {
        // Create a map of new orders based on the provided order
        const orderMap = new Map(taskIdsInOrder.map((id, index) => [id, index]));

        const updatedTasks = state.tasks.map(task => {
            if (task.status === status && orderMap.has(task.id)) {
                return { ...task, order: orderMap.get(task.id)! };
            }
            return task;
        });

        // Sort tasks by status and order
        const sortedTasks = updatedTasks.sort((a, b) => {
            if (a.status !== b.status) {
                return a.status.localeCompare(b.status);
            }
            return a.order - b.order;
        });

        return { ...state, tasks: sortedTasks };
    })
);