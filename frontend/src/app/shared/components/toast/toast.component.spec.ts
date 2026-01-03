import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import { ToastService } from '../../../core/services/toast.service';
import { MessageType } from '../../../core/models/api-response';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    service = TestBed.inject(ToastService);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should set background when bgColor is called', () => {

    const testCases: { input: MessageType, expected: string }[] = [
      { input: 'SUCCESS', expected: 'green' },
      { input: 'ERROR', expected: 'red' },
      { input: 'INFO', expected: 'blue' },
      { input: '' as MessageType, expected: 'gray' }
    ];
    
    testCases.forEach(({ input, expected }) => {
      it(`should return ${expected} when input is ${input}`, () => {
        spyOn(service, 'toast').and.returnValue({ message: '', type: input });
        expect(component.bgColor()).toContain(expected);
      });
    });

  })
});
