import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/ui/modal.component';
import { Note } from '../../../models/note.model';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, ReactiveFormsModule],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="mode === 'create' ? 'Nouvelle note' : 'Modifier la note'"
      [confirmText]="mode === 'create' ? 'Créer' : 'Enregistrer'"
      [isConfirmValid]="noteForm.valid"
      (close)="onClose()"
      (confirm)="onSubmit()">
      
      <form [formGroup]="noteForm" class="flex flex-col gap-4">
        
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Titre (optionnel)</label>
          <input 
            type="text" 
            formControlName="title"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ex: Idées de projets..." 
          />
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Contenu <span class="text-rose-500">*</span></label>
          <textarea 
            formControlName="content"
            rows="5"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" 
            placeholder="Saisissez votre note ici..."
          ></textarea>
          <p *ngIf="noteForm.get('content')?.touched && noteForm.get('content')?.hasError('required')" class="text-rose-500 text-xs mt-1">
            Le contenu est obligatoire.
          </p>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Tags (séparés par des virgules)</label>
          <input 
            type="text" 
            formControlName="tags"
            class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Ex: perso, finance" 
          />
        </div>

        <!-- Archive Checkbox -->
        <div *ngIf="mode === 'edit'" class="flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="archived" 
            formControlName="archived"
            class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
          />
          <label for="archived" class="text-sm font-medium text-slate-700">Archiver cette note</label>
        </div>

      </form>
      
      <!-- Delete Action -->
      <div *ngIf="mode === 'edit'" class="mt-6 flex justify-center border-t border-slate-100 pt-4">
        <button type="button" (click)="onDelete()" class="text-rose-600 hover:text-rose-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          Supprimer
        </button>
      </div>

    </app-modal>
  `
})
export class NoteModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialNote: Note | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Partial<Note>>();
  @Output() delete = new EventEmitter<string>();

  noteForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.noteForm = this.fb.group({
      title: [''],
      content: ['', Validators.required],
      tags: [''],
      archived: [false]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      if (this.mode === 'edit' && this.initialNote) {
        this.noteForm.patchValue({
          title: this.initialNote.title || '',
          content: this.initialNote.content,
          tags: this.initialNote.tags.join(', '),
          archived: this.initialNote.archived
        });
      } else {
        this.noteForm.reset({
          title: '',
          content: '',
          tags: '',
          archived: false
        });
      }
    }
  }

  onClose() {
    this.noteForm.reset();
    this.close.emit();
  }

  onSubmit() {
    if (this.noteForm.valid) {
      const raw = this.noteForm.value;
      const parsedTags = raw.tags
        ? raw.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t.length >= 2 && t.length <= 20).slice(0, 10)
        : [];
      
      const payload: Partial<Note> = {
        title: raw.title || undefined,
        content: raw.content,
        tags: parsedTags,
        archived: raw.archived ?? false
      };

      this.save.emit(payload);
      this.onClose();
    }
  }

  onDelete() {
    if (this.mode === 'edit' && this.initialNote) {
      this.delete.emit(this.initialNote.id);
      this.onClose();
    }
  }
}
