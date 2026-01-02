import { Component, signal } from '@angular/core';
import { ToastComponent } from './shared/components/toast/toast.component';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = signal('task-manager-angular18-ngrx') ;
}
