import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksBoardComponent } from './tasks-board.component';
import { provideStore, Store } from '@ngrx/store';
import { taskReducer } from '../../store/task.reducer';
import { loadTasks } from '../../store/task.actions';

describe('TasksBoardComponent', () => {
  let component: TasksBoardComponent;
  let fixture: ComponentFixture<TasksBoardComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksBoardComponent],
      providers:[provideStore({tasks: taskReducer})]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksBoardComponent);
    store = TestBed.inject(Store)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks when ngOnInit is called',()=>{
    spyOn(store, 'dispatch')
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(loadTasks())
  })
});
