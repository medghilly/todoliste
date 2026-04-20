import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getClasses()">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: 'high' | 'medium' | 'low' | 'info' | 'success' | 'warning' = 'info';
  @Input() class = '';

  getClasses(): string {
    const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    
    const variants = {
      high: 'bg-rose-50 text-rose-700',
      medium: 'bg-amber-50 text-amber-700',
      low: 'bg-emerald-50 text-emerald-700',
      info: 'bg-blue-50 text-blue-700',
      success: 'bg-emerald-50 text-emerald-700',
      warning: 'bg-amber-50 text-amber-700'
    };

    return `${base} ${variants[this.variant]} ${this.class}`;
  }
}
