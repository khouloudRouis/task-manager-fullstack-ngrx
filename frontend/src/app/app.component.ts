import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TasksBoardComponent } from './features/tasks/pages/tasks-board/tasks-board.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TasksBoardComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task-manager-angular18-ngrx';
}
