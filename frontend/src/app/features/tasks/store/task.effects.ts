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
            this.toastService.show(error.message, error.type);
            return of(TaskActions.loadTasksFailure({ error: error.message }))})
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
            this.toastService.show(error.message, error.type);
            return of(TaskActions.deleteTaskFailure({ error: error.message }));
          })
        )
      )
    )
  );

}
