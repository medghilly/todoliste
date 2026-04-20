import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../../models/note.model';
import { CardComponent } from '../../../shared/components/ui/card.component';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <app-card [hoverable]="true" class="flex flex-col group h-full relative" *ngIf="note">
      <!-- Pin action -->
      <button 
        (click)="togglePin($event)"
        class="absolute top-4 right-4 text-slate-300 hover:text-amber-500 transition-colors z-10"
        [class.text-amber-500]="note.pinned">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [ngClass]="note.pinned ? 'fill-current' : 'fill-none'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      <div class="flex-1 cursor-pointer flex flex-col" (click)="onClick.emit(note)">
        <h3 class="font-bold text-slate-900 pr-6 mb-2" *ngIf="note.title">{{ note.title }}</h3>
        
        <p class="text-sm text-slate-600 whitespace-pre-wrap flex-1 min-h-[4rem]" [ngClass]="{'opacity-75': !note.title, 'line-clamp-4': true}">
          {{ note.content }}
        </p>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>{{ note.updatedAt | date:'short' }}</span>
          
          <div class="flex items-center gap-1" *ngIf="note.tags.length > 0">
            <span class="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase tracking-wider text-[9px] max-w-[60px] truncate" *ngIf="note.tags[0]">
              {{ note.tags[0] }}
            </span>
            <span *ngIf="note.tags.length > 1" class="text-slate-400">
              +{{ note.tags.length - 1 }}
            </span>
          </div>
        </div>
      </div>
    </app-card>
  `
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() onClick = new EventEmitter<Note>();
  @Output() onTogglePin = new EventEmitter<{id: string, pinned: boolean}>();

  togglePin(event: Event) {
    event.stopPropagation();
    this.onTogglePin.emit({ id: this.note.id, pinned: !this.note.pinned });
  }
}
