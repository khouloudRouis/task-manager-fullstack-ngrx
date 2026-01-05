import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service'; 

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should show toast immediately', () => {
    service.show('Success message', 'SUCCESS');

    const toast = service.toast();
    expect(toast).not.toBeNull();
    expect(toast?.message).toBe('Success message');
    expect(toast?.type).toBe('SUCCESS');
  });

  it('should clear toast after duration', fakeAsync(() => {
    service.show('Auto clear', 'INFO', 3000);
    expect(service.toast()).not.toBeNull();

    tick(3000);

    expect(service.toast()).toBeNull();
  }));

  it('should clear toast manually', () => {
    service.show('Manual clear', 'ERROR');

    service.clear();

    expect(service.toast()).toBeNull();
  });
});
