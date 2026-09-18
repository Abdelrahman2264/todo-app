import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray
} from '@angular/cdk/drag-drop';
import { TaskService } from '../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  badgeClass: string;
}

@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    RouterLink,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css'
})
export class TaskBoard {
  protected readonly taskService = inject(TaskService);

  protected readonly tasks = toSignal(this.taskService.getTasksObservable(), {
    requireSync: true
  });

  protected readonly search = signal('');
  protected readonly priorityFilter = signal<TaskPriority | 'All'>('All');

  readonly columns: BoardColumn[] = [
    { id: 'Pending', title: 'Pending', badgeClass: 'status-pending' },
    { id: 'In Progress', title: 'In Progress', badgeClass: 'status-in-progress' },
    { id: 'Completed', title: 'Completed', badgeClass: 'status-completed' }
  ];

  protected readonly priorities: (TaskPriority | 'All')[] = ['All', 'Low', 'Medium', 'High'];

  private filterList(list: Task[]): Task[] {
    const term = this.search().trim().toLowerCase();
    const priority = this.priorityFilter();

    return list.filter((t) => {
      const matchesTerm =
        !term ||
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term);
      const matchesPriority = priority === 'All' || t.priority === priority;
      return matchesTerm && matchesPriority;
    });
  }

  getTasksByStatus(status: TaskStatus): Task[] {
    const columnTasks = this.tasks().filter((t) => t.status === status);
    return this.filterList(columnTasks);
  }

  onDrop(event: CdkDragDrop<Task[], Task[], Task>): void {
    const targetStatus = event.container.id as TaskStatus;
    const task = event.item.data as Task;

    if (event.previousContainer === event.container) {
      // Reorder within the same status column
      const colTasks = [...event.container.data];
      moveItemInArray(colTasks, event.previousIndex, event.currentIndex);
      const otherTasks = this.tasks().filter((t) => t.status !== targetStatus);
      this.taskService.reorderTasks([...otherTasks, ...colTasks]);
    } else {
      // Moved to another column: update task status
      this.taskService.updateTaskStatus(task.id, targetStatus);
    }
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

  protected priorityClass(priority: string): string {
    return 'pill-' + priority.toLowerCase();
  }
}
