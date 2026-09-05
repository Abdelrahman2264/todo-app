export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskDraft = Omit<Task, 'id' | 'createdAt' | 'completedAt'>;

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
  byPriority: Record<TaskPriority, number>;
  byCategory: { category: string; count: number }[];
  last7Days: { label: string; created: number; completed: number }[];
}

export type AlertType = 'overdue' | 'long_running' | 'high_priority_pending';

export interface TaskAlert {
  task: Task;
  type: AlertType;
  title: string;
  description: string;
  daysCount: number;
}

