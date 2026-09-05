import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { TaskPriority, TaskStatus } from '../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEditMode = false;
  taskId: number | null = null;

  readonly statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];
  readonly existingCategories = this.taskService.getCategories();

  taskForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    status: ['Pending' as TaskStatus, Validators.required],
    priority: ['Medium' as TaskPriority, Validators.required],
    category: ['General', Validators.required],
    dueDate: ['']
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.taskId = Number(id);
      const task = this.taskService.getTaskById(this.taskId);

      if (task) {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          category: task.category,
          dueDate: task.dueDate ?? ''
        });
      } else {
        this.router.navigate(['/tasks']);
      }
    }
  }

  get title() {
    return this.taskForm.controls.title;
  }
  get description() {
    return this.taskForm.controls.description;
  }
  get status() {
    return this.taskForm.controls.status;
  }
  get priority() {
    return this.taskForm.controls.priority;
  }
  get category() {
    return this.taskForm.controls.category;
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const value = this.taskForm.getRawValue();
    const taskData = {
      title: value.title.trim(),
      description: value.description.trim(),
      status: value.status,
      priority: value.priority,
      category: value.category.trim() || 'General',
      dueDate: value.dueDate || undefined
    };

    if (this.isEditMode && this.taskId !== null) {
      this.taskService.updateTask(this.taskId, taskData);
    } else {
      this.taskService.addTask(taskData);
    }

    this.router.navigate(['/tasks']);
  }
}
