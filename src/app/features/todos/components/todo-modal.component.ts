import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/ui/modal.component';
import { Todo, TodoStatus, TodoPriority } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="mode === 'create' ? 'Nouvelle tâche' : 'Modifier la tâche'"
      [confirmText]="mode === 'create' ? 'Créer' : 'Enregistrer'"
      [isConfirmValid]="todoForm.valid"
      (close)="onClose()"
      (confirm)="onSubmit()">
      
      <form [formGroup]="todoForm" class="flex flex-col gap-4">
        
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Titre <span class="text-rose-500">*</span></label>
          <input 
            type="text" 
            formControlName="title"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ex: Acheter du pain" 
          />
          <p *ngIf="todoForm.get('title')?.touched && todoForm.get('title')?.hasError('required')" class="text-rose-500 text-xs mt-1">
            Le titre est requis.
          </p>
          <p *ngIf="todoForm.get('title')?.touched && todoForm.get('title')?.hasError('minlength')" class="text-rose-500 text-xs mt-1">
            Minimum 3 caractères.
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            formControlName="description"
            rows="3"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" 
            placeholder="Détails de la tâche..."
          ></textarea>
        </div>

        <!-- Row: Priority & Status -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
            <select 
              formControlName="priority"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <div *ngIf="mode === 'edit'">
            <label class="block text-sm font-medium text-slate-700 mb-1">Statut</label>
            <select 
              formControlName="status"
              class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
              <option value="todo">À faire</option>
              <option value="doing">En cours</option>
              <option value="done">Terminée</option>
            </select>
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Date d'échéance</label>
          <input 
            type="date" 
            formControlName="dueDate"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tags (séparés par des virgules)</label>
          <input 
            type="text" 
            formControlName="tags"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ex: travail, urgent" 
          />
          <p class="text-xs text-slate-500 mt-1">Max 10 tags, 2-20 caractères</p>
        </div>

      </form>
      
      <!-- Delete Action -->
      <div *ngIf="mode === 'edit'" class="mt-6 flex justify-center border-t border-slate-100 pt-4">
        <button type="button" (click)="onDelete()" class="text-rose-600 hover:text-rose-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Supprimer cette tâche
        </button>
      </div>

    </app-modal>
  `
})
export class TodoModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialTodo: Todo | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Todo>>();
  @Output() delete = new EventEmitter<string>();

  todoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
      description: [''],
      priority: ['medium'],
      status: ['todo'],
      dueDate: [''],
      tags: [''] // will parse as string[] internally
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.mode === 'edit' && this.initialTodo) {
        this.todoForm.patchValue({
          title: this.initialTodo.title,
          description: this.initialTodo.description || '',
          priority: this.initialTodo.priority,
          status: this.initialTodo.status,
          dueDate: this.initialTodo.dueDate || '',
          tags: this.initialTodo.tags.join(', ')
        });
      } else {
        this.todoForm.reset({
          title: '',
          description: '',
          priority: 'medium',
          status: 'todo',
          dueDate: '',
          tags: ''
        });
      }
    }
  }

  onClose() {
    this.todoForm.reset();
    this.close.emit();
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const raw = this.todoForm.value;
      const parsedTags = raw.tags
        ? raw.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length >= 2 && t.length <= 20).slice(0, 10)
        : [];
      
      const payload: Partial<Todo> = {
        title: raw.title,
        description: raw.description || undefined,
        priority: raw.priority as TodoPriority,
        status: raw.status as TodoStatus,
        dueDate: raw.dueDate || undefined,
        tags: parsedTags
      };

      this.save.emit(payload);
      this.onClose();
    }
  }

  onDelete() {
    if (this.mode === 'edit' && this.initialTodo) {
      this.delete.emit(this.initialTodo.id);
      this.onClose();
    }
  }
}
