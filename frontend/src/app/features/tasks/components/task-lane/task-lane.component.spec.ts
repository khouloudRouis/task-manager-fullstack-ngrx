import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLaneComponent } from './task-lane.component';
import { provideStore, Store } from '@ngrx/store';
import { taskReducer } from '../../store/task.reducer';
import { Task } from '../../../../core/models/task';
import { of } from 'rxjs';
import { addTask, updateTask } from '../../store/task.actions';

describe('TaskLaneComponent', () => {
  let component: TaskLaneComponent;
  let fixture: ComponentFixture<TaskLaneComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskLaneComponent],
      providers: [provideStore({ tasks: taskReducer })]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskLaneComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tasks when ngOnInit is called', () => {
    const result = [{ title: 'card title', description: 'card description', id: '0' }] as Task[]
    spyOn(store, 'select').and.returnValue(of(result));

    component.ngOnInit();

    expect(component.tasks).toEqual(result);
  });

  describe('should update order and status when onDrop is called', () => {
    it('should reorder task', () => {
      const event = { currentIndex: 0, item: { data: { title: 'test', status: 'DOING' } as Task } } as never;
      component.status = 'DOING'
      spyOn(store, 'dispatch');

      component.onDrop(event);

      const result = { title: 'test', status: 'DOING', order: 100 } as Task;
      expect(store.dispatch).toHaveBeenCalledWith(updateTask({ task: result }))
    });

    it('should reorder and update status task', () => {
      const event = { currentIndex: 0, item: { data: { title: 'test', status: 'DOING' } as Task } } as never;
      component.status = 'DONE'
      spyOn(store, 'dispatch');

      component.onDrop(event);

      const result = { title: 'test', status: 'DONE', order: 100 } as Task;
      expect(store.dispatch).toHaveBeenCalledWith(updateTask({ task: result }))
    });
  });

  describe('should update or add task form when onSave is called', () => {
    it('should call addTask when id is undefined', () => {
      const task = { title: 'test', description: 'test description' } as Task;
      component.status = 'DOING'
      spyOn(store, 'dispatch');

      component.onSave(task);

      expect(store.dispatch).toHaveBeenCalledWith(addTask({ task: { ...task, ...{ status: 'DOING', order: 100 } } }))
    });

    it('should call addTask when id is defined', () => {
      const task = { title: 'test', description: 'test description', id:'0' } as Task;
      spyOn(store, 'dispatch');

      component.onSave(task);

      expect(store.dispatch).toHaveBeenCalledWith(updateTask({ task }))

    });
  });

  it('should open add task form when onAddTask is called', () => {
    component.onAddTask();

    expect(component.task).toBeUndefined();
    expect(component.showTaskForm).toBeTruthy();
  });

  it('should open add task form when onAddTask is called', () => {
    component.onEditTask({ title: 'test' } as Task);

    expect(component.task).toEqual({ title: 'test' } as Task);
    expect(component.showTaskForm).toBeTruthy();
  });
});
