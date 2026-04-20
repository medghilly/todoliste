import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/layout/sidebar.component';
import { BottomNavComponent } from './shared/components/layout/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, BottomNavComponent],
  template: `
    <div class="flex h-screen w-full bg-slate-50 overflow-hidden">
      <!-- Sidebar Desktop -->
      <app-sidebar></app-sidebar>

      <!-- Zone principale -->
      <main class="flex-1 flex flex-col h-full overflow-hidden relative pb-[72px] md:pb-0">
        <router-outlet></router-outlet>
      </main>

      <!-- Navigation Mobile -->
      <app-bottom-nav></app-bottom-nav>
    </div>
  `
})
export class App {}
