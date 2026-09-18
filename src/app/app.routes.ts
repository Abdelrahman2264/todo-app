import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { TaskList } from './tasks/task-list';
import { TaskForm } from './tasks/task-form';
import { Alerts } from './alerts/alerts';

import { TaskBoard } from './tasks/task-board';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, title: 'Dashboard · Flow' },
  { path: 'tasks', component: TaskList, title: 'Tasks · Flow' },
  { path: 'board', component: TaskBoard, title: 'Task Board · Flow' },
  { path: 'alerts', component: Alerts, title: 'Long Task Alerts · Flow' },
  { path: 'tasks/add', component: TaskForm, title: 'Add Task · Flow' },
  { path: 'tasks/edit/:id', component: TaskForm, title: 'Edit Task · Flow' },
  { path: '**', redirectTo: 'dashboard' }
];

