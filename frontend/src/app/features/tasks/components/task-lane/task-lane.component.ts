import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDragDrop, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Task, TaskStatus } from '../../../../core/models/task';
import { Store } from '@ngrx/store';
import { updateTaskStatus, reorderTasks } from '../../store/task.actions';

@Component({
  selector: 'app-task-lane',
  standalone: true,
  imports: [TaskCardComponent, CdkDropList, CdkDrag, CommonModule],
  templateUrl: './task-lane.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskLaneComponent {
  private readonly store = inject(Store);
  connectedLaneIds = ['TODO', 'DOING', 'DONE'];
  @Input() selectTasksByStatus$!: Observable<Task[]>;
  @Input() status!: TaskStatus;

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

  addTask(status: TaskStatus): void {
    // TODO: Implement task creation functionality
    // This should dispatch an addTask action to the store
  }
}
