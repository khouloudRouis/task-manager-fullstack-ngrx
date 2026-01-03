import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardComponent } from './task-card.component';
import { provideStore, Store } from '@ngrx/store';
import { taskReducer } from '../../store/task.reducer';
import { deleteTask } from '../../store/task.actions';
import { Task } from '../../../../core/models/task';
import { EventEmitter } from '@angular/core';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
      providers: [provideStore({ tasks: taskReducer })]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    component.task = { status: 'TODO', title: 'Card 1', description: 'a card for test', id: '0' } as Task;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch deleteTask action when onDelete is called', () => {
    spyOn(store, 'dispatch')

    component.onDelete();

    expect(store.dispatch).toHaveBeenCalledWith(deleteTask(({ taskId: component.task.id })))
  });

  it('should emit edit event when onEdit is called', () => {
    const spyOnEvent = spyOn(EventEmitter.prototype, 'emit')

    component.onEdit();
    
    expect(spyOnEvent).toHaveBeenCalled()
  })
});
