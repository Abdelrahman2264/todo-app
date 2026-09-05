import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { TaskPriority, TaskStatus } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css'
})
export class TaskList {
  protected readonly taskService = inject(TaskService);

  protected readonly tasks = toSignal(this.taskService.getTasksObservable(), {
    requireSync: true
  });

  protected readonly search = signal('');
  protected readonly statusFilter = signal<TaskStatus | 'All'>('All');
  protected readonly priorityFilter = signal<TaskPriority | 'All'>('All');
  protected readonly categoryFilter = signal<string>('All');

  protected readonly statuses: (TaskStatus | 'All')[] = ['All', 'Pending', 'In Progress', 'Completed'];
  protected readonly priorities: (TaskPriority | 'All')[] = ['All', 'Low', 'Medium', 'High'];

  protected readonly categories = computed(() => ['All', ...this.taskService.getCategories()]);

  protected readonly filteredTasks = computed(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    const category = this.categoryFilter();

    return this.tasks().filter((task) => {
      const matchesTerm =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);
      const matchesStatus = status === 'All' || task.status === status;
      const matchesPriority = priority === 'All' || task.priority === priority;
      const matchesCategory = category === 'All' || task.category === category;
      return matchesTerm && matchesStatus && matchesPriority && matchesCategory;
    });
  });

  protected readonly hasActiveFilters = computed(
    () =>
      this.search().length > 0 ||
      this.statusFilter() !== 'All' ||
      this.priorityFilter() !== 'All' ||
      this.categoryFilter() !== 'All'
  );

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('All');
    this.priorityFilter.set('All');
    this.categoryFilter.set('All');
  }

  toggleComplete(id: number): void {
    this.taskService.toggleComplete(id);
  }

  deleteTask(id: number, title: string): void {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      this.taskService.deleteTask(id);
    }
  }

  isOverdue(dueDate: string | undefined, status: TaskStatus): boolean {
    if (!dueDate || status === 'Completed') return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  }

  protected statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(' ', '-');
  }

  protected priorityClass(priority: string): string {
    return 'pill-' + priority.toLowerCase();
  }
}
