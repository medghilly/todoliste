import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/layout/header.component';
import { NoteCardComponent } from './components/note-card.component';
import { NoteModalComponent } from './components/note-modal.component';
import { NoteService } from '../../core/state/note.service';
import { Note } from '../../models/note.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NoteCardComponent, NoteModalComponent, FormsModule],
  template: `
    <div class="h-full flex flex-col bg-slate-50 relative">
      <app-header title="Notes" subtitle="Vos idées rapides" [addLabel]="'Ajouter'" [showBackButton]="true" (onAddClick)="openCreateModal()"></app-header>
      
      <div class="flex-1 flex flex-col overflow-hidden">
        
        <!-- Toolbar -->
        <div class="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
          <div class="relative w-full max-w-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Rechercher une note..." 
              [ngModel]="filters().query"
              (ngModelChange)="onSearchChange($event)"
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            >
          </div>
        </div>

        <!-- Grid Content -->
        <div class="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
            <app-note-card 
              *ngFor="let note of notes()" 
              [note]="note" 
              (onClick)="openEditModal($event)"
              (onTogglePin)="handleTogglePin($event)">
            </app-note-card>
          </div>

          <div *ngIf="notes().length === 0" class="text-center py-20 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 mt-4">
            <span class="text-4xl">📝</span>
            <p>Aucune note trouvée</p>
          </div>
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

    <app-note-modal 
      [isOpen]="isModalOpen"
      [mode]="modalMode"
      [initialNote]="selectedNote"
      (close)="closeModal()"
      (save)="handleSave($event)"
      (delete)="handleDelete($event)">
    </app-note-modal>
  `
})
export class NotesPageComponent {
  private noteService = inject(NoteService);

  notes = toSignal(this.noteService.filteredNotes$, { initialValue: [] as Note[] });
  filters = () => this.noteService.getFilters();

  // Modal State
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedNote: Note | null = null;

  onSearchChange(query: string) {
    this.noteService.setFilters({ query });
  }

  handleTogglePin(event: {id: string, pinned: boolean}) {
    this.noteService.updateNote(event.id, { pinned: event.pinned });
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedNote = null;
    this.isModalOpen = true;
  }

  openEditModal(note: Note) {
    this.modalMode = 'edit';
    this.selectedNote = note;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedNote = null;
  }

  handleSave(payload: Partial<Note>) {
    if (this.modalMode === 'create') {
      this.noteService.addNote(payload as Omit<Note, 'id'|'createdAt'|'updatedAt'|'pinned'|'archived'>);
    } else if (this.modalMode === 'edit' && this.selectedNote) {
      this.noteService.updateNote(this.selectedNote.id, payload);
    }
  }

  handleDelete(id: string) {
    this.noteService.deleteNote(id);
  }
}
