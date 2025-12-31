import { Component, computed, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  standalone: true
})
export class ToastComponent {
 toastService = inject(ToastService);

  bgColor = computed(() => {
    const type = this.toastService.toast()?.type;
    switch (type) {
      case 'success': return 'bg-green-100/70 text-green-800';
      case 'error': return 'bg-red-100/70 text-red-800';
      case 'info': return 'bg-blue-100/70 text-blue-800';
      default: return 'bg-gray-100/70 text-gray-800';
    }
  });
}
