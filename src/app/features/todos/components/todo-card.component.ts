import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../models/todo.model';
import { CardComponent } from '../../../shared/components/ui/card.component';
import { BadgeComponent } from '../../../shared/components/ui/badge.component';

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  template: `
    <app-card [hoverable]="true" class="flex flex-col gap-3 group relative pl-10" *ngIf="todo">
      
      <!-- Checkbox / Status toggle on the left edge -->
      <button 
        (click)="toggleStatus($event)"
        class="absolute left-4 top-4 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm"
        [ngClass]="{
          'bg-emerald-500 border-emerald-500 text-white': todo.status === 'done',
          'border-slate-300 bg-white hover:border-emerald-500': todo.status !== 'done'
        }">
        <svg *ngIf="todo.status === 'done'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Content -->
      <div class="flex-1 cursor-pointer" (click)="onClick.emit(todo)">
        <div class="flex items-start justify-between">
          <h3 class="font-semibold text-slate-900 pr-2" [class.line-through]="todo.status === 'done'" [class.text-slate-400]="todo.status === 'done'">
            {{ todo.title }}
          </h3>
          <app-badge [variant]="todo.status === 'done' ? 'success' : todo.priority" class="shrink-0">
            {{ todo.priority | titlecase }}
          </app-badge>
        </div>
        
        <p class="text-sm text-slate-500 mt-1 line-clamp-2" *ngIf="todo.description" [class.opacity-60]="todo.status === 'done'">
          {{ todo.description }}
        </p>
        
        <div class="flex items-center gap-3 mt-3 text-xs text-slate-500 font-medium">
          <!-- Due Date -->
          <div class="flex items-center gap-1" *ngIf="todo.dueDate" [ngClass]="{'text-rose-500': isOverdue()}">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ todo.dueDate | date:'shortDate' }}
          </div>
          
          <!-- Tags -->
          <div class="flex flex-wrap gap-1" *ngIf="todo.tags.length > 0">
            <span *ngFor="let tag of todo.tags" class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </app-card>
  `
})
export class TodoCardComponent {
  @Input() todo!: Todo;
  @Output() onClick = new EventEmitter<Todo>();
  @Output() onStatusChange = new EventEmitter<{id: string, newStatus: 'todo' | 'doing' | 'done'}>();

  toggleStatus(event: Event) {
    event.stopPropagation();
    const newStatus = this.todo.status === 'done' ? 'todo' : 'done';
    this.onStatusChange.emit({ id: this.todo.id, newStatus });
  }

  isOverdue(): boolean {
    if (!this.todo.dueDate || this.todo.status === 'done') return false;
    const today = new Date().toISOString().split('T')[0];
    return this.todo.dueDate < today;
  }
}
