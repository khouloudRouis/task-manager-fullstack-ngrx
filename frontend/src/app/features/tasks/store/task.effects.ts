import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { TaskApiService } from '../../../core/api/task-api.service';
import * as TaskActions from './task.actions';
import { ToastService } from '../../../core/services/toast.service';


@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private taskApi = inject(TaskApiService);
  private toastService = inject(ToastService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      switchMap(() =>
        this.taskApi.getTasks().pipe(
          tap(response => this.toastService.show(response.message, response.type)),
          map(response => TaskActions.loadTasksSuccess({ tasks: response?.data })),
          catchError(error => {
            const errorMessage = error?.error?.message || error?.message || 'Failed to load tasks';
            const errorType = error?.error?.type || error?.type || 'ERROR';
            this.toastService.show(errorMessage, errorType);
            return of(TaskActions.loadTasksFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      switchMap(({ taskId }) =>
        this.taskApi.deleteTask(taskId).pipe(
          tap(response => this.toastService.show(response.message, response.type)),
          map(() => TaskActions.deleteTaskSuccess({ taskId })),
          catchError(error => {
            const errorMessage = error?.error?.message || error?.message || 'Failed to delete task';
            const errorType = error?.error?.type || error?.type || 'ERROR';
            this.toastService.show(errorMessage, errorType);
            return of(TaskActions.deleteTaskFailure({ taskId, error: errorMessage }));
          })
        )
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.addTask),
      switchMap(({task}) =>
        this.taskApi.createTask(task).pipe(
          tap(response => this.toastService.show(response.message, response.type)),
          map(response => TaskActions.addTaskSuccess({ taskId: response.data.id })),
          catchError(error => {
            const errorMessage = error?.error?.message || error?.message || 'Failed to add task';
            const errorType = error?.error?.type || error?.type || 'ERROR';
            this.toastService.show(errorMessage, errorType);
            return of(TaskActions.addTaskFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

 updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      switchMap(({ task }) =>
        this.taskApi.updateTask(task.id, task).pipe(
          tap(response => this.toastService.show(response.message, response.type)),
          map(() => TaskActions.updateTaskSuccess({ task })),
          catchError(error => {
            const errorMessage = error?.error?.message || error?.message || 'Failed to update task';
            const errorType = error?.error?.type || error?.type || 'ERROR';
            this.toastService.show(errorMessage, errorType);
            return of(TaskActions.updateTaskFailure({ taskId: task.id, error: errorMessage }));
          })
        )
      )
    )
  );  
}