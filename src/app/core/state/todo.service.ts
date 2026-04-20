import { Injectable, computed, signal, effect } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Todo, TodoStatus, TodoPriority } from '../../models/todo.model';
import { LocalStorageService } from '../storage/local-storage.service';

const TODOS_KEY = 'todonote.todos';

export interface TodoFilters {
  query: string;
  status: TodoStatus | 'all';
  priority: TodoPriority | 'all';
  tag: string | 'all';
  overdue: boolean;
}

export interface TodoSort {
  by: 'dueDate' | 'priority' | 'createdAt';
  asc: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$: Observable<Todo[]> = this.todosSubject.asObservable();

  private filtersSignal = signal<TodoFilters>({
    query: '',
    status: 'all',
    priority: 'all',
    tag: 'all',
    overdue: false,
  });

  private sortSignal = signal<TodoSort>({ by: 'createdAt', asc: false });

  constructor(private storageService: LocalStorageService) {
    this.loadTodos();
    // In RxJS we could use combineLatest, but we can also handle it by filtering on the client or combining locally.
    // For MVVM simplicity with BehaviorSubjects, we'll expose a filteredTodos$ observable
  }

  get filteredTodos$(): Observable<Todo[]> {
    return this.todos$.pipe(
      map(todos => this.applyFiltersAndSort(todos))
    );
  }

  private loadTodos() {
    const saved = this.storageService.getItem<Todo[]>(TODOS_KEY);
    if (saved) {
      this.todosSubject.next(saved);
    }
  }

  private saveTodos(todos: Todo[]) {
    this.storageService.setItem(TODOS_KEY, todos);
    this.todosSubject.next(todos);
  }

  getTodos(): Todo[] {
    return this.todosSubject.getValue();
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const current = this.getTodos();
    this.saveTodos([...current, newTodo]);
  }

  updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) {
    const current = this.getTodos();
    const updated = current.map(t => {
      if (t.id === id) {
        const merged = { ...t, ...updates, updatedAt: new Date().toISOString() };
        if (updates.status === 'done' && t.status !== 'done') {
          merged.completedAt = new Date().toISOString();
        } else if (updates.status && updates.status !== 'done' && t.status === 'done') {
          merged.completedAt = undefined;
        }
        return merged;
      }
      return t;
    });
    this.saveTodos(updated);
  }

  deleteTodo(id: string) {
    const current = this.getTodos();
    this.saveTodos(current.filter(t => t.id !== id));
  }

  setFilters(filters: Partial<TodoFilters>) {
    this.filtersSignal.update(f => ({ ...f, ...filters }));
    // Trigger update to refresh filtered observable natively
    this.todosSubject.next(this.todosSubject.getValue());
  }
  
  getFilters(): TodoFilters {
    return this.filtersSignal();
  }

  setSort(sort: Partial<TodoSort>) {
    this.sortSignal.update(s => ({ ...s, ...sort }));
    this.todosSubject.next(this.todosSubject.getValue());
  }

  private applyFiltersAndSort(todos: Todo[]): Todo[] {
    const filters = this.filtersSignal();
    const sort = this.sortSignal();
    const today = new Date().toISOString().split('T')[0];

    // Filter
    let result = todos.filter(t => {
      if (filters.status !== 'all' && t.status !== filters.status) return false;
      if (filters.priority !== 'all' && t.priority !== filters.priority) return false;
      if (filters.query && !t.title.toLowerCase().includes(filters.query.toLowerCase()) && !(t.description && t.description.toLowerCase().includes(filters.query.toLowerCase()))) return false;
      if (filters.tag !== 'all' && !t.tags.includes(filters.tag)) return false;
      if (filters.overdue) {
        if (!t.dueDate || t.status === 'done' || t.dueDate >= today) {
          return false;
        }
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      let valA: any;
      let valB: any;
      
      if (sort.by === 'dueDate') {
        valA = a.dueDate ?? (sort.asc ? '9999-12-31' : '0000-01-01');
        valB = b.dueDate ?? (sort.asc ? '9999-12-31' : '0000-01-01');
      } else if (sort.by === 'priority') {
        const weight = { 'low': 1, 'medium': 2, 'high': 3 };
        valA = weight[a.priority];
        valB = weight[b.priority];
      } else {
        valA = a.createdAt;
        valB = b.createdAt;
      }

      if (valA < valB) return sort.asc ? -1 : 1;
      if (valA > valB) return sort.asc ? 1 : -1;
      return 0;
    });

    return result;
  }
}
