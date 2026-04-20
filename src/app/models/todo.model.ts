export type TodoStatus = 'todo' | 'doing' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string; // ISO string format usually expected
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}
