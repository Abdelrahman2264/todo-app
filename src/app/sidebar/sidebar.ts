import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiService } from '../services/ui.service';
import { ThemeService } from '../services/theme.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  protected readonly ui = inject(UiService);
  protected readonly theme = inject(ThemeService);
  private readonly taskService = inject(TaskService);

  protected readonly alertCount = toSignal(this.taskService.getAlertsCountObservable(), {
    initialValue: 0
  });

  protected readonly navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '◧' },
    { path: '/tasks', label: 'All Tasks', icon: '☰' },
    { path: '/board', label: 'Task Board', icon: '▦' },
    { path: '/alerts', label: 'Long Tasks', icon: '⚠️', isAlert: true },
    { path: '/tasks/add', label: 'Add Task', icon: '＋' }
  ];

  closeOnMobile(): void {
    this.ui.closeMobile();
  }
}
