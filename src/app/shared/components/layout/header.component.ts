import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../ui/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  template: `
    <header class="flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40 shrink-0">
      <div class="flex items-center gap-3">
        <!-- Bouton retour accueil -->
        <a *ngIf="showBackButton" routerLink="/"
           class="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 shadow-sm transition-all"
           title="Retour à l'accueil">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">{{ title }}</h1>
          <p class="text-sm text-slate-500 mt-0.5" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <app-button variant="primary" class="hidden md:flex gap-2" (onClick)="onAddClick.emit()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          {{ addLabel }}
        </app-button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Input() title = 'Dashboard';
  @Input() subtitle = '';
  @Input() addLabel = 'Nouveau';
  @Input() showBackButton = false;

  @Output() onAddClick = new EventEmitter<void>();
}
