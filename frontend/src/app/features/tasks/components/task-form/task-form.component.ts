import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../../../core/models/task';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,   TranslatePipe],
  templateUrl: './task-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnChanges {

  @Input() task?: Task;
  @Input() status: TaskStatus = 'TODO';

  @Output() submitForm = new EventEmitter<Partial<Task>>();
  @Output() cancelled = new EventEmitter<void>();

  taskForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  });
 

  ngOnChanges() {
    this.taskForm.reset();
    if (this.task) {
      this.taskForm.patchValue(this.task);
    }
  }

  onSubmit() {
    this.submitForm.emit({ ...this.task, ...this.taskForm.value } as Partial<Task>);
    this.taskForm.reset();
  }
}
