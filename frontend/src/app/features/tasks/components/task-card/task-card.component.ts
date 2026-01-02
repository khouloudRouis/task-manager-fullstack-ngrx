import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../core/models/task';
import { Store } from '@ngrx/store';
import { deleteTask } from '../../store/task.actions';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<void>();
  
  private readonly store = inject(Store);

  onDelete() {
   this.store.dispatch(deleteTask({ taskId: this.task.id }));
  }
  onEdit() {
    this.edit.emit();
  }
}
