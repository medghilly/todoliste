import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../models/todo.model';
import { TodoCardComponent } from './todo-card.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoCardComponent],
  template: `
    <div class="space-y-3">
      <app-todo-card 
        *ngFor="let todo of todos" 
        [todo]="todo" 
        (onClick)="onTodoClick.emit($event)"
        (onStatusChange)="onStatusChange.emit($event)">
      </app-todo-card>
      
      <div *ngIf="todos.length === 0" class="text-center py-12 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p>Aucune tâche trouvée</p>
      </div>
    </div>
  `
})
export class TodoListComponent {
  @Input() todos: Todo[] = [];
  @Output() onTodoClick = new EventEmitter<Todo>();
  @Output() onStatusChange = new EventEmitter<{id: string, newStatus: 'todo' | 'doing' | 'done'}>();
}
