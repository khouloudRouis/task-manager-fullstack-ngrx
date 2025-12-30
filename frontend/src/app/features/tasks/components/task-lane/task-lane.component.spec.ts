import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskLaneComponent } from './task-lane.component';

describe('TaskLaneComponent', () => {
  let component: TaskLaneComponent;
  let fixture: ComponentFixture<TaskLaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskLaneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
