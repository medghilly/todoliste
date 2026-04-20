import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Note } from '../../models/note.model';
import { LocalStorageService } from '../storage/local-storage.service';

const NOTES_KEY = 'todonote.notes';

export interface NoteFilters {
  query: string;
  tag: string | 'all';
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$: Observable<Note[]> = this.notesSubject.asObservable();

  private filtersSignal = signal<NoteFilters>({
    query: '',
    tag: 'all',
  });

  constructor(private storageService: LocalStorageService) {
    this.loadNotes();
  }

  get filteredNotes$(): Observable<Note[]> {
    return this.notes$.pipe(
      map(notes => this.applyFilters(notes))
    );
  }

  private loadNotes() {
    const saved = this.storageService.getItem<Note[]>(NOTES_KEY);
    if (saved) {
      this.notesSubject.next(saved);
    }
  }

  private saveNotes(notes: Note[]) {
    this.storageService.setItem(NOTES_KEY, notes);
    this.notesSubject.next(notes);
  }

  getNotes(): Note[] {
    return this.notesSubject.getValue();
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'pinned' | 'archived'>) {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      pinned: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const current = this.getNotes();
    this.saveNotes([...current, newNote]);
  }

  updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) {
    const current = this.getNotes();
    const updated = current.map(n => {
      if (n.id === id) {
        return { ...n, ...updates, updatedAt: new Date().toISOString() };
      }
      return n;
    });
    this.saveNotes(updated);
  }

  deleteNote(id: string) {
    const current = this.getNotes();
    this.saveNotes(current.filter(n => n.id !== id));
  }

  setFilters(filters: Partial<NoteFilters>) {
    this.filtersSignal.update(f => ({ ...f, ...filters }));
    this.notesSubject.next(this.notesSubject.getValue());
  }

  getFilters(): NoteFilters {
    return this.filtersSignal();
  }

  private applyFilters(notes: Note[]): Note[] {
    const filters = this.filtersSignal();

    let result = notes.filter(n => {
      if (n.archived) return false; // By default, don't show archived
      if (filters.tag !== 'all' && !n.tags.includes(filters.tag)) return false;
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (
          !(n.title && n.title.toLowerCase().includes(q)) &&
          !n.content.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    // Pinned notes always first, then by updatedAt descending
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return a.updatedAt > b.updatedAt ? -1 : 1;
    });

    return result;
  }
}
