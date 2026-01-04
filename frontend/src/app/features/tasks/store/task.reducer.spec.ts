import { taskReducer } from './task.reducer';
import { initialTasksState } from './task.state';
import {
  loadTasks,
  loadTasksSuccess,
  loadTasksFailure,
  addTask,
  addTaskSuccess,
  addTaskFailure,
  updateTask,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTask,
  deleteTaskSuccess,
  deleteTaskFailure
} from './task.actions';
import { Task } from '../../../core/models/task';

describe('Task Reducer', () => {

  const task1 = { id: '1', title: 'Task 1' } as Task;
  const task2 = { id: '2', title: 'Task 2' } as Task;
  const newTask = { title: 'New Task' } as Task; 

  it('should set loading true on loadTasks', () => {
    const state = taskReducer(initialTasksState, loadTasks());
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should populate tasks on loadTasksSuccess', () => {
    const state = taskReducer(initialTasksState, loadTasksSuccess({ tasks: [task1, task2] }));
    expect(state.tasks.length).toBe(2);
    expect(state.loading).toBeFalse();
  });

  it('should set error on loadTasksFailure', () => {
    const state = taskReducer(initialTasksState, loadTasksFailure({ error: 'Load failed' }));
    expect(state.error).toBe('Load failed');
    expect(state.loading).toBeFalse();
  });

  it('should optimistically add a task on addTask', () => {
    const state = taskReducer(initialTasksState, addTask({ task: newTask }));
    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0].title).toBe('New Task');
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should assign id and set loading false on addTaskSuccess', () => {
    let state = taskReducer(initialTasksState, addTask({ task: newTask }));
    state = taskReducer(state, addTaskSuccess({ taskId: '123' }));
    expect(state.tasks[0].id).toBe('123');
    expect(state.loading).toBeFalse();
  });

  it('should remove optimistically added task on addTaskFailure', () => {
    let state = taskReducer(initialTasksState, addTask({ task: newTask }));
    state = taskReducer(state, addTaskFailure({ error: 'Add failed' }));
    expect(state.tasks.length).toBe(0);
    expect(state.error).toBe('Add failed');
    expect(state.loading).toBeFalse();
  });

  it('should optimistically update a task on updateTask', () => {
    const startState = { ...initialTasksState, tasks: [task1] };
    const updated = { ...task1, title: 'Updated Task' };
    const state = taskReducer(startState, updateTask({ task: updated }));
    expect(state.tasks[0].title).toBe('Updated Task');
    expect(state.previousTasks['1']).toEqual(task1);
    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
  });

  it('should finalize update on updateTaskSuccess', () => {
    const startState = { ...initialTasksState, tasks: [task1], previousTasks: { '1': task1 } };
    const updated = { ...task1, title: 'Updated Task' };
    const state = taskReducer(startState, updateTaskSuccess({ task: updated }));
    expect(state.tasks[0].title).toBe('Updated Task');
    expect(state.previousTasks['1']).toBeUndefined();
    expect(state.error).toBeNull();
  });

  it('should rollback on updateTaskFailure', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startState = { ...initialTasksState, tasks: [{ id: '1', title: 'Temp' }], previousTasks: { '1': task1 } } as any;
    const state = taskReducer(startState, updateTaskFailure({ taskId: '1', error: 'Update failed' }));
    expect(state.tasks[0].title).toBe('Task 1'); 
    expect(state.previousTasks['1']).toBeUndefined();
    expect(state.error).toBe('Update failed');
  });

  it('should optimistically delete a task on deleteTask', () => {
    const startState = { ...initialTasksState, tasks: [task1] };
    const state = taskReducer(startState, deleteTask({ taskId: '1' }));
    expect(state.tasks.length).toBe(0);
    expect(state.previousTasks['1']).toEqual(task1);
  });

  it('should finalize delete on deleteTaskSuccess', () => {
    const startState = { ...initialTasksState, previousTasks: { '1': task1 } };
    const state = taskReducer(startState, deleteTaskSuccess({ taskId: '1' }));
    expect(state.previousTasks['1']).toBeUndefined();
    expect(state.error).toBeNull();
  });

  it('should rollback delete on deleteTaskFailure', () => {
    const startState = { ...initialTasksState, tasks: [], previousTasks: { '1': task1 } };
    const state = taskReducer(startState, deleteTaskFailure({ taskId: '1', error: 'Delete failed' }));
    expect(state.tasks.length).toBe(1);
    expect(state.tasks[0]).toEqual(task1);
    expect(state.previousTasks['1']).toBeUndefined();
    expect(state.error).toBe('Delete failed');
  });

});
