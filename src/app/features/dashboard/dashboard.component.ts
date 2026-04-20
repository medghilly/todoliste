import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/layout/header.component';
import { TodoService } from '../../core/state/todo.service';
import { NoteService } from '../../core/state/note.service';
import { RouterModule, Router } from '@angular/router';
import { BadgeComponent } from '../../shared/components/ui/badge.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Todo } from '../../models/todo.model';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule, BadgeComponent],
  template: `
    <div class="h-full flex flex-col bg-slate-50">
      <app-header title="Dashboard" subtitle="Votre vue d'ensemble" [addLabel]="'Nouvelle tâche'" (onAddClick)="navigateToAddTodo()"></app-header>

      <div class="flex-1 overflow-y-auto p-6 space-y-8">

        <!-- Navigation rapide -->
        <section class="flex flex-wrap gap-3">
          <a routerLink="/todos"
             class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mes Todos
          </a>
          <a routerLink="/notes"
             class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Mes Notes
          </a>
          <button (click)="navigateToAddTodo()"
             class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 active:scale-[0.99] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle tâche
          </button>
          <a routerLink="/notes" [queryParams]="{add: true}"
             class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium shadow-sm hover:bg-amber-600 active:scale-[0.99] transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Nouvelle note
          </a>
        </section>

        <!-- KPIs Section — cliquables -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a routerLink="/todos" class="block rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-600">À faire</p>
                <p class="text-3xl font-bold text-slate-900 mt-1">{{ todoKpi() }}</p>
                <p class="text-xs text-blue-500 mt-1 group-hover:underline">Voir les tâches →</p>
              </div>
              <div class="p-3 bg-white rounded-xl shadow-sm text-xl">📝</div>
            </div>
          </a>

          <a routerLink="/todos" [queryParams]="{overdue: true}" class="block rounded-2xl border border-rose-100 bg-rose-50 p-4 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-rose-600">En retard</p>
                <p class="text-3xl font-bold text-slate-900 mt-1">{{ overdueKpi() }}</p>
                <p class="text-xs text-rose-500 mt-1 group-hover:underline">Voir les retards →</p>
              </div>
              <div class="p-3 bg-white rounded-xl shadow-sm text-xl">⚠️</div>
            </div>
          </a>

          <a routerLink="/todos" [queryParams]="{status: 'done'}" class="block rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group cursor-pointer">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-emerald-600">Terminées</p>
                <p class="text-3xl font-bold text-slate-900 mt-1">{{ doneKpi() }}</p>
                <p class="text-xs text-emerald-500 mt-1 group-hover:underline">Voir les terminées →</p>
              </div>
              <div class="p-3 bg-white rounded-xl shadow-sm text-xl">✅</div>
            </div>
          </a>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Today's Tasks -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-slate-900">Aujourd'hui</h2>
              <a routerLink="/todos" class="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Voir tout
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div class="space-y-3">
              <a *ngFor="let todo of todayTodos()" routerLink="/todos"
                 class="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-2 cursor-pointer">
                <div class="flex items-start justify-between">
                  <h3 class="font-semibold text-slate-900" [class.line-through]="todo.status === 'done'">{{ todo.title }}</h3>
                  <app-badge [variant]="todo.status === 'done' ? 'success' : todo.priority">{{ todo.priority | titlecase }}</app-badge>
                </div>
                <p class="text-sm text-slate-500 line-clamp-2" *ngIf="todo.description">{{ todo.description }}</p>
              </a>

              <div *ngIf="todayTodos().length === 0" class="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-3">
                <span class="text-3xl">🎉</span>
                <p class="font-medium">Aucune tâche pour aujourd'hui !</p>
                <a routerLink="/todos" [queryParams]="{add: true}"
                   class="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                  Ajouter une tâche
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <!-- Pinned Notes -->
          <section>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold text-slate-900">Notes épinglées</h2>
              <a routerLink="/notes" class="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Voir tout
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div class="space-y-3">
              <a *ngFor="let note of pinnedNotes()" routerLink="/notes"
                 class="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-2 cursor-pointer">
                <div class="flex items-start justify-between">
                  <h3 class="font-semibold text-slate-900" *ngIf="note.title">{{ note.title }}</h3>
                  <span class="text-amber-500 shrink-0">📌</span>
                </div>
                <p class="text-sm text-slate-600 line-clamp-3 whitespace-pre-wrap">{{ note.content }}</p>
              </a>

              <div *ngIf="pinnedNotes().length === 0" class="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center gap-3">
                <span class="text-3xl">📝</span>
                <p class="font-medium">Aucune note épinglée.</p>
                <a routerLink="/notes"
                   class="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                  Créer une note
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  `

})
export class DashboardComponent {
  private todoService = inject(TodoService);
  private noteService = inject(NoteService);
  private router = inject(Router);

  navigateToAddTodo() {
    this.router.navigate(['/todos'], { queryParams: { add: true } });
  }

  todos = toSignal(this.todoService.todos$, { initialValue: [] as Todo[] });
  notes = toSignal(this.noteService.notes$, { initialValue: [] as Note[] });

  todoKpi = computed(() => this.todos().filter(t => t.status === 'todo' || t.status === 'doing').length);
  doneKpi = computed(() => this.todos().filter(t => t.status === 'done').length);
  overdueKpi = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.todos().filter(t => t.dueDate && t.dueDate < today && t.status !== 'done').length;
  });

  todayTodos = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.todos()
      .filter(t => t.status !== 'done' && (!t.dueDate || t.dueDate === today))
      .sort((a, b) => b.priority.localeCompare(a.priority))
      .slice(0, 5);
  });

  pinnedNotes = computed(() => {
    return this.notes()
      .filter(n => n.pinned && !n.archived)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  });

}
