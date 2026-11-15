import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class NoticeStore {
  readonly message = signal('');
  readonly kind = signal<'success' | 'error'>('success');
  show(message: string, kind: 'success' | 'error' = 'success'): void {
    this.kind.set(kind);
    this.message.set(message);
  }
  clear(): void {
    this.message.set('');
  }
}
