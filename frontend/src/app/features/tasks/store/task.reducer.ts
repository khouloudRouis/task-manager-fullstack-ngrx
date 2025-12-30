import { createReducer, on } from '@ngrx/store';
import { initialTasksState } from './tasks.state';
import { addTask, deleteTask, loadTasks, loadTasksSuccess, loadTasksFailure, reorderTasks, updateTask, updateTaskStatus } from './task.actions';
import { TaskStatus } from '../../../core/models/task';

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
        error: null
    })),

    on(loadTasksFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

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
        let updatedTasks = state.tasks.map(task => {
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

    on(updateTask, (state, { task }) => {
        const updatedTasks = state.tasks.map(t =>
            t.id === task.id ? { ...t, ...task } : t
        );
        return { ...state, tasks: updatedTasks };
    }),

    on(addTask, (state, { title, status }) => {
        const newTask = {
            id: Date.now().toString(),
            title,
            status,
            description: '',
            order: state.tasks.filter(t => t.status === status).length,
            createdAt: new Date().toISOString()
        };
        return { ...state, tasks: [...state.tasks, newTask] };
    }),

    on(deleteTask, (state, { taskId }) => {
        const filteredTasks = state.tasks.filter(task => task.id !== taskId);
        return { ...state, tasks: filteredTasks };
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