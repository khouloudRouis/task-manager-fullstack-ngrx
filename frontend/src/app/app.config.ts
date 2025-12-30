import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { taskReducer } from './features/tasks/store/task.reducer';
import { TaskEffects } from './features/tasks/store/task.effects';
import { UserIdInterceptor } from './core/interceptor/user-id.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([UserIdInterceptor]), withFetch()), 
    provideEffects([TaskEffects]),
    provideStore({tasks: taskReducer}),
  ]
};
