import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/toast-message';
import { MessageType } from '../models/api-response';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<ToastMessage | null>(null);

  show(message: string, type: MessageType, duration = 3000) {
    this.toast.set({ message, type });

    setTimeout(() => this.toast.set(null), duration);
  }

  clear() {
    this.toast.set(null);
  }
}
