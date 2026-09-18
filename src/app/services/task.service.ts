import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Task, TaskAlert, TaskDraft, TaskPriority, TaskStats, TaskStatus } from '../models/task.model';

const STORAGE_KEY = 'flow-tasks';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const SEED_TASKS: Task[] = [
  {
    id: 1,
    title: 'Learn Angular signals',
    description: 'Study Angular signals, computed values and effects.',
    status: 'Pending',
    priority: 'High',
    category: 'Learning',
    dueDate: daysAgoIso(-2).slice(0, 10),
    createdAt: daysAgoIso(6)
  },
  {
    id: 2,
    title: 'Refactor HTML structure',
    description: 'Clean up semantic HTML and accessibility attributes.',
    status: 'Completed',
    priority: 'High',
    category: 'Development',
    dueDate: daysAgoIso(1).slice(0, 10),
    createdAt: daysAgoIso(5),
    completedAt: daysAgoIso(1)
  },
  {
    id: 3,
    title: 'Design new color themes',
    description: 'Explore a fresh, non-default color palette for light and dark modes.',
    status: 'Completed',
    priority: 'Medium',
    category: 'Design',
    dueDate: daysAgoIso(2).slice(0, 10),
    createdAt: daysAgoIso(4),
    completedAt: daysAgoIso(2)
  },
  {
    id: 4,
    title: 'Build responsive sidebar',
    description: 'Collapsible on desktop, off-canvas on mobile.',
    status: 'In Progress',
    priority: 'Low',
    category: 'Development',
    dueDate: daysAgoIso(-3).slice(0, 10),
    createdAt: daysAgoIso(5)
  },
  {
    id: 5,
    title: 'Wire up dashboard charts',
    description: 'Status donut, priority bars and a 7-day activity trend.',
    status: 'Pending',
    priority: 'High',
    category: 'Development',
    dueDate: daysAgoIso(1).slice(0, 10), // overdue!
    createdAt: daysAgoIso(4)
  },
  {
    id: 6,
    title: 'Write project README',
    description: 'Document setup steps and folder structure for the team.',
    status: 'Pending',
    priority: 'Medium',
    category: 'Docs',
    dueDate: daysAgoIso(-8).slice(0, 10),
    createdAt: daysAgoIso(4)
  }
];

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks: Task[] = [];
  private readonly taskSubject = new BehaviorSubject<Task[]>([]);

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    this.tasks = stored ? (JSON.parse(stored) as Task[]) : SEED_TASKS;
    this.taskSubject.next(this.tasks);
    if (!stored) {
      this.saveTasks();
    }
  }

  private saveTasks(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
  }

  private emit(): void {
    this.saveTasks();
    this.taskSubject.next([...this.tasks]);
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getTasksObservable(): Observable<Task[]> {
    return this.taskSubject.asObservable();
  }

  getTaskById(id: number): Task | undefined {
    return this.tasks.find((task) => task.id === id);
  }

  getCategories(): string[] {
    const set = new Set(this.tasks.map((t) => t.category).filter(Boolean));
    return Array.from(set).sort();
  }

  clearAllTasks(): void {
    this.tasks = [];
    this.emit();
  }

  loadSampleTasks(): void {
    this.tasks = [...SEED_TASKS];
    this.emit();
  }

  addTask(draft: TaskDraft): Task {
    const newTask: Task = {
      id: this.getNextId(),
      createdAt: new Date().toISOString(),
      completedAt: draft.status === 'Completed' ? new Date().toISOString() : undefined,
      ...draft
    };
    this.tasks.push(newTask);
    this.emit();
    return newTask;
  }

  updateTask(id: number, draft: TaskDraft): boolean {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    const existing = this.tasks[index];
    const wasCompleted = existing.status === 'Completed';
    const nowCompleted = draft.status === 'Completed';

    this.tasks[index] = {
      ...existing,
      ...draft,
      completedAt: nowCompleted
        ? (existing.completedAt ?? new Date().toISOString())
        : wasCompleted && !nowCompleted
          ? undefined
          : existing.completedAt
    };

    this.emit();
    return true;
  }

  deleteTask(id: number): boolean {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.emit();
    return true;
  }

  updateTaskStatus(id: number, newStatus: TaskStatus): boolean {
    const task = this.getTaskById(id);
    if (!task) return false;
    return this.updateTask(id, {
      title: task.title,
      description: task.description,
      status: newStatus,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate
    });
  }

  reorderTasks(tasks: Task[]): void {
    this.tasks = [...tasks];
    this.emit();
  }

  toggleComplete(id: number): void {
    const task = this.getTaskById(id);
    if (!task) return;
    const nextStatus: TaskStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    this.updateTask(id, {
      title: task.title,
      description: task.description,
      status: nextStatus,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate
    });
  }

  extendDueDate(id: number, daysToAdd: number = 3): void {
    const task = this.getTaskById(id);
    if (!task) return;
    const current = task.dueDate ? new Date(task.dueDate) : new Date();
    current.setDate(current.getDate() + daysToAdd);
    const newDueDate = current.toISOString().slice(0, 10);
    this.updateTask(id, {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: newDueDate
    });
  }

  getStatsObservable(): Observable<TaskStats> {
    return this.taskSubject.pipe(map((tasks) => this.computeStats(tasks)));
  }

  getAlertsObservable(): Observable<TaskAlert[]> {
    return this.taskSubject.pipe(map((tasks) => this.computeAlerts(tasks)));
  }

  getAlertsCountObservable(): Observable<number> {
    return this.getAlertsObservable().pipe(map((alerts) => alerts.length));
  }

  private computeAlerts(tasks: Task[]): TaskAlert[] {
    const alerts: TaskAlert[] = [];
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const t of tasks) {
      if (t.status === 'Completed') continue;

      const createdDate = new Date(t.createdAt);
      const daysOld = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));

      // 1. Overdue Check
      if (t.dueDate) {
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        if (due < today) {
          const overdueDays = Math.ceil((today.getTime() - due.getTime()) / (1000 * 3600 * 24));
          alerts.push({
            task: t,
            type: 'overdue',
            title: `Overdue Task`,
            description: `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`,
            daysCount: overdueDays
          });
          continue;
        }
      }

      // 2. Long Running / Stagnant Check (> 3 days old)
      if (daysOld >= 3) {
        alerts.push({
          task: t,
          type: 'long_running',
          title: `Long-Running Task`,
          description: `Active for ${daysOld} days without completion`,
          daysCount: daysOld
        });
        continue;
      }

      // 3. High Priority Pending
      if (t.priority === 'High' && t.status === 'Pending') {
        alerts.push({
          task: t,
          type: 'high_priority_pending',
          title: `High Priority Pending`,
          description: `High priority task needs urgent attention`,
          daysCount: daysOld
        });
      }
    }

    return alerts;
  }

  private computeStats(tasks: Task[]): TaskStats {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter((t) => {
      if (t.status === 'Completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < today;
    }).length;

    const byPriority: Record<TaskPriority, number> = { Low: 0, Medium: 0, High: 0 };
    for (const t of tasks) byPriority[t.priority]++;

    const categoryMap = new Map<string, number>();
    for (const t of tasks) {
      categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + 1);
    }
    const byCategory = Array.from(categoryMap.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);

      const created = tasks.filter((t) => {
        const c = new Date(t.createdAt);
        return c >= d && c < next;
      }).length;

      const completedCount = tasks.filter((t) => {
        if (!t.completedAt) return false;
        const c = new Date(t.completedAt);
        return c >= d && c < next;
      }).length;

      return {
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        created,
        completed: completedCount
      };
    });

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      byPriority,
      byCategory,
      last7Days
    };
  }

  private getNextId(): number {
    return this.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  }
}

