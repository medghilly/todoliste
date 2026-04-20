import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent)
  },
  {
    path: 'todos',
    loadComponent: () => import('./features/todos/todos-page.component').then(c => c.TodosPageComponent)
  },
  {
    path: 'notes',
    loadComponent: () => import('./features/notes/notes-page.component').then(c => c.NotesPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
