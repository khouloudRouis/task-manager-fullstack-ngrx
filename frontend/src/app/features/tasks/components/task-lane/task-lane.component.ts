import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDragDrop, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Task, TaskStatus } from '../../../../core/models/task';
import { Store } from '@ngrx/store';
import { updateTaskStatus, reorderTasks, addTask, updateTask } from '../../store/task.actions';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-lane',
  standalone: true,
  imports: [TaskCardComponent,
    CdkDropList,
    CdkDrag,
    CommonModule,
    TaskFormComponent],
  templateUrl: './task-lane.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskLaneComponent {

  private readonly store = inject(Store);
  connectedLaneIds = ['TODO', 'DOING', 'DONE'];
  @Input() selectTasksByStatus$!: Observable<Task[]>;
  @Input() status!: TaskStatus;
  task: Task | undefined;
  showTaskForm = false;

  drop({ item, previousIndex, currentIndex }: CdkDragDrop<Task[]>) {
    const task = item.data as Task;
    if (!task) return;

    if (task.status === this.status) {
      if (previousIndex === currentIndex) return;

      this.selectTasksByStatus$.pipe(take(1)).subscribe(tasks => {
        const ids = tasks.map(t => t.id);
        moveItemInArray(ids, previousIndex, currentIndex);
        this.store.dispatch(
          reorderTasks({ taskIdsInOrder: ids, status: this.status })
        );
      });
    } else {
      this.store.dispatch(
        updateTaskStatus({ taskId: task.id, newStatus: this.status })
      );
    }
  }

  save(event: Partial<Task>): void {
    this.showTaskForm = !this.showTaskForm;
    if (event.id) {
      console.log('updating task', event);
      this.store.dispatch(updateTask({ task: event as Task }));
    } else {
      const payload = { status: this.status || 'TODO' as TaskStatus, title: event.title || '', description: event.description || '' };
      this.store.dispatch(addTask(payload));
    }
  }

  onEditTask(event: Task): void {
    this.showTaskForm = true
    this.task = event as Task | undefined;
  }

  onAddTask(): void {
    this.showTaskForm = true
    this.task = undefined;
  }
}
