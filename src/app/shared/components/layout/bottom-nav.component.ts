import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-between z-40 pb-safe">
      <a routerLink="/" routerLinkActive="text-blue-600" [routerLinkActiveOptions]="{exact: true}"
         class="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-slate-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px] font-medium">Accueil</span>
      </a>
      
      <a routerLink="/todos" routerLinkActive="text-blue-600"
         class="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-slate-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-[10px] font-medium">Todos</span>
      </a>

      <a routerLink="/notes" routerLinkActive="text-blue-600"
         class="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-slate-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span class="text-[10px] font-medium">Notes</span>
      </a>
    </nav>
  `,
  styles: [`
    .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
  `]
})
export class BottomNavComponent {}
