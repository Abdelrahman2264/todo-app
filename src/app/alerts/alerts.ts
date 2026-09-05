import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TaskService } from '../services/task.service';
import { AlertType, TaskAlert } from '../models/task.model';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css'
})
export class Alerts {
  protected readonly taskService = inject(TaskService);

  protected readonly alerts = toSignal(this.taskService.getAlertsObservable(), {
    initialValue: []
  });

  protected readonly selectedFilter = signal<'all' | AlertType>('all');

  protected readonly filteredAlerts = computed(() => {
    const list = this.alerts();
    const filter = this.selectedFilter();
    if (filter === 'all') return list;
    return list.filter((a) => a.type === filter);
  });

  protected readonly overdueCount = computed(() =>
    this.alerts().filter((a) => a.type === 'overdue').length
  );

  protected readonly longRunningCount = computed(() =>
    this.alerts().filter((a) => a.type === 'long_running').length
  );

  protected readonly highPriorityCount = computed(() =>
    this.alerts().filter((a) => a.type === 'high_priority_pending').length
  );

  setFilter(filter: 'all' | AlertType): void {
    this.selectedFilter.set(filter);
  }

  completeTask(taskId: number): void {
    this.taskService.toggleComplete(taskId);
  }

  extendDueDate(taskId: number): void {
    this.taskService.extendDueDate(taskId, 3);
  }

  deleteTask(taskId: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
    }
  }

  badgeClass(type: AlertType): string {
    switch (type) {
      case 'overdue':
        return 'badge-overdue';
      case 'long_running':
        return 'badge-long';
      case 'high_priority_pending':
        return 'badge-urgent';
    }
  }
}
