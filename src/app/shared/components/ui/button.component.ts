import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="getClasses()"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() class = '';

  @Output() onClick = new EventEmitter<MouseEvent>();

  getClasses(): string {
    const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] focus:ring-blue-500 shadow-sm',
      secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-200',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.99] focus:ring-rose-500 shadow-sm',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200'
    };

    return `${base} ${variants[this.variant]} ${this.class}`;
  }
}
