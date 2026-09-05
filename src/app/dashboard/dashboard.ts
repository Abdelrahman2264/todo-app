import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { DonutChart, DonutSlice } from '../shared/donut-chart/donut-chart';
import { BarChart, BarDatum } from '../shared/bar-chart/bar-chart';
import { TrendChart } from '../shared/trend-chart/trend-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, DonutChart, BarChart, TrendChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  protected readonly taskService = inject(TaskService);

  protected readonly stats = toSignal(this.taskService.getStatsObservable(), {
    requireSync: true
  });

  protected readonly tasks = toSignal(this.taskService.getTasksObservable(), {
    requireSync: true
  });

  protected readonly recentTasks = computed(() =>
    [...this.tasks()]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  protected readonly statusSlices = computed<DonutSlice[]>(() => {
    const s = this.stats();
    return [
      { label: 'Completed', value: s.completed, color: 'var(--success)' },
      { label: 'In Progress', value: s.inProgress, color: 'var(--accent)' },
      { label: 'Pending', value: s.pending, color: 'var(--warning)' }
    ];
  });

  protected readonly priorityBars = computed<BarDatum[]>(() => {
    const s = this.stats();
    return [
      { label: 'High', value: s.byPriority.High, color: 'var(--danger)' },
      { label: 'Medium', value: s.byPriority.Medium, color: 'var(--warning)' },
      { label: 'Low', value: s.byPriority.Low, color: 'var(--success)' }
    ];
  });

  protected readonly categoryBars = computed<BarDatum[]>(() => {
    const palette = ['var(--primary)', 'var(--accent)', 'var(--warning)', 'var(--success)', 'var(--danger)'];
    return this.stats().byCategory.slice(0, 5).map((c, i) => ({
      label: c.category,
      value: c.count,
      color: palette[i % palette.length]
    }));
  });

  protected statusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace(' ', '-');
  }

  protected priorityClass(priority: string): string {
    return 'pill-' + priority.toLowerCase();
  }
}
