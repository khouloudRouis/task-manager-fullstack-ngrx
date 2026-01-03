import { ChangeDetectionStrategy, Component, Input, inject, OnInit } from '@angular/core';
import { TaskCardComponent } from '../task-card/task-card.component';
import { CommonModule } from '@angular/common';
import { CdkDropList, CdkDragDrop, CdkDrag } from '@angular/cdk/drag-drop';
import { Task, TaskStatus } from '../../../../core/models/task';
import { Store } from '@ngrx/store';
import { addTask, updateTask } from '../../store/task.actions';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskUtils } from '../../../../shared/utils/task-util';
import { selectTasksByStatus } from '../../store/task.selectors';
import { Observable } from 'rxjs';


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
export class TaskLaneComponent implements OnInit {

  @Input() status!: TaskStatus;
  @Input() tasksByStatus$!:Observable<Task[]>;

  connectedLaneIds: TaskStatus[] = ['TODO', 'DOING', 'DONE'];
  tasks!: Task[];
  task: Task | undefined;
  showTaskForm = false;

  private readonly store = inject(Store);

  ngOnInit(){
   this.store.select(selectTasksByStatus(this.status)).subscribe(
    tasks => this.tasks = tasks
   );
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const movedTask = { ...event.item.data } as Task;
    if (movedTask.status !== this.status)
      movedTask.status = this.status; 
      const prev = this.tasks[event.currentIndex - 1];
      const next =  this.tasks[event.currentIndex + 1]; 
      movedTask.order = TaskUtils.calculateOrder(prev, next); 
      this.store.dispatch(updateTask({ task: movedTask }));
  }

  onSave(event: Partial<Task>): void {
    this.showTaskForm = !this.showTaskForm;
    if (event.id) {
      this.store.dispatch(updateTask({ task: event as Task }));
    } else { 
        const prev = TaskUtils.lastTask(this.tasks);
        const order = (prev?.order ?? 0) + 100;
        const payload = {
          status: this.status as TaskStatus,
          title: event.title || '',
          description: event.description || '',
          order: order
        };
        this.store.dispatch(addTask({ task: payload as Task }));
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
