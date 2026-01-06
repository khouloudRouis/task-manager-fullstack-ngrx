import { Component, inject, signal } from '@angular/core';
import { ToastComponent } from './shared/components/toast/toast.component';
import { RouterOutlet } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = signal('task-manager-angular18-ngrx');
  readonly languages = [
    { label: 'Français', code: 'fr' },
    { label: 'English', code: 'en' },
    { label: 'Deutsch', code: 'de' }
  ];

  private translate = inject(TranslateService);

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
