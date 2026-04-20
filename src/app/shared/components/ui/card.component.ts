import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getClasses()">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {
  @Input() class = '';
  @Input() hoverable = false;

  getClasses(): string {
    let base = 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm';
    if (this.hoverable) {
      base += ' transition-shadow hover:shadow-md cursor-pointer';
    }
    return `${base} ${this.class}`;
  }
}
