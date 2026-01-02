import { Component, inject, OnInit } from '@angular/core';
import { TaskLaneComponent } from '../../components/task-lane/task-lane.component';
import { Store } from '@ngrx/store';
import { TaskStatus } from '../../../../core/models/task'; 
import { loadTasks } from '../../store/task.actions';

@Component({
  selector: 'app-tasks-board',
  standalone: true,
  imports: [TaskLaneComponent],
  templateUrl: './tasks-board.component.html',
})
export class TasksBoardComponent implements OnInit {
  private readonly store = inject(Store);
  statuses: TaskStatus[] = ['TODO', 'DOING', 'DONE'];

  ngOnInit(): void {
    this.store.dispatch(loadTasks());
  }
}
