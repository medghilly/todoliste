import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/layout/header.component';
import { TodoListComponent } from './components/todo-list.component';
import { TodoModalComponent } from './components/todo-modal.component';
import { TodoService, TodoFilters } from '../../core/state/todo.service';
import { Todo, TodoStatus, TodoPriority } from '../../models/todo.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-todos-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TodoListComponent, TodoModalComponent, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-slate-50 relative">
      <app-header title="Tâches" subtitle="Gérez vos todos" [addLabel]="'Ajouter'" [showBackButton]="true" (onAddClick)="openCreateModal()"></app-header>
      
      <div class="flex-1 flex flex-col overflow-hidden">
        
        <!-- Filters Toolbar -->
        <div class="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shrink-0">
          
          <div class="relative w-full md:w-64 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              [ngModel]="filters().query"
              (ngModelChange)="onSearchChange($event)"
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            >
          </div>

          <!-- Chips -->
          <div class="flex items-center gap-2 overflow-x-auto w-full custom-scrollbar pb-1 md:pb-0">
            <button 
              (click)="toggleStatus('all')"
              class="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors"
              [ngClass]="filters().status === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
              Toutes
            </button>
            <button 
              (click)="toggleStatus('todo')"
              class="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors"
              [ngClass]="filters().status === 'todo' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
              À faire
            </button>
            <button 
              (click)="toggleStatus('doing')"
              class="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors"
              [ngClass]="filters().status === 'doing' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
              En cours
            </button>
            <button 
              (click)="toggleStatus('done')"
              class="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors"
              [ngClass]="filters().status === 'done' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
              Terminées
            </button>
            <div class="w-px h-6 bg-slate-200 mx-1"></div>
            <button 
              (click)="toggleOverdue()"
              class="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors flex items-center gap-1"
              [ngClass]="filters().overdue ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              En retard
            </button>
          </div>
        </div>

        <!-- List Content -->
        <div class="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <app-todo-list 
            [todos]="todos() || []" 
            (onTodoClick)="openEditModal($event)"
            (onStatusChange)="handleStatusChange($event)">
          </app-todo-list>
        </div>
      </div>

      <!-- Floating Button Mobile -->
      <button 
        (click)="openCreateModal()"
        class="md:hidden absolute bottom-6 right-6 h-14 w-14 bg-blue-600 text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

    </div>

    <app-todo-modal 
      [isOpen]="isModalOpen"
      [mode]="modalMode"
      [initialTodo]="selectedTodo"
      (close)="closeModal()"
      (save)="handleSave($event)"
      (delete)="handleDelete($event)">
    </app-todo-modal>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  `]
})
export class TodosPageComponent {
  private todoService = inject(TodoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  todos = toSignal(this.todoService.filteredTodos$, { initialValue: [] as Todo[] });

  // Syncing local UI filters
  filters = () => this.todoService.getFilters();

  // Modal State
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedTodo: Todo | null = null;

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['add']) {
        this.openCreateModal();
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });
      }
      if (params['status']) {
        this.todoService.setFilters({ status: params['status'] });
      }
      if (params['overdue'] === 'true') {
        this.todoService.setFilters({ overdue: true });
      }
    });
  }

  onSearchChange(query: string) {
    this.todoService.setFilters({ query });
  }

  toggleStatus(status: TodoStatus | 'all') {
    this.todoService.setFilters({ status });
  }

  toggleOverdue() {
    const current = this.todoService.getFilters().overdue;
    this.todoService.setFilters({ overdue: !current });
  }

  handleStatusChange(event: {id: string, newStatus: 'todo' | 'doing' | 'done'}) {
    this.todoService.updateTodo(event.id, { status: event.newStatus });
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedTodo = null;
    this.isModalOpen = true;
  }

  openEditModal(todo: Todo) {
    this.modalMode = 'edit';
    this.selectedTodo = todo;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTodo = null;
  }

  handleSave(payload: Partial<Todo>) {
    if (this.modalMode === 'create') {
      this.todoService.addTodo(payload as Omit<Todo, 'id'|'createdAt'|'updatedAt'>);
    } else if (this.modalMode === 'edit' && this.selectedTodo) {
      this.todoService.updateTodo(this.selectedTodo.id, payload);
    }
  }

  handleDelete(id: string) {
    this.todoService.deleteTodo(id);
  }
}
