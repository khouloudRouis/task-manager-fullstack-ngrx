import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { Task } from '../../../../core/models/task';
import { FormControl, FormGroup } from '@angular/forms';
import { EventEmitter } from '@angular/core';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    component.task = { title: 'card title', description: 'card desciption' } as Task;
    component.taskForm = new FormGroup({ title: new FormControl(''), description: new FormControl('') })
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set form when ngOnChanges is called', () => {
    spyOn(component.taskForm, 'reset')
    spyOn(component.taskForm, 'patchValue')

    component.ngOnChanges();
    
    expect(component.taskForm.reset).toHaveBeenCalled();
    expect(component.taskForm.patchValue).toHaveBeenCalled();
  });
  it('should set form when ngOnChanges is called', () => {
    const spyOnEvent = spyOn(EventEmitter.prototype, 'emit')
    spyOn(component.taskForm, 'reset')

    component.onSubmit();

    expect(component.taskForm.reset).toHaveBeenCalled();
    expect(spyOnEvent).toHaveBeenCalled();
  });
});
