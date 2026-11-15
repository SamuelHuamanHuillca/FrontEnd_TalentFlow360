import { Component, input } from '@angular/core';
export function humanize(value: unknown): string {
  return String(value ?? 'Sin información')
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/^./, (c) => c.toUpperCase());
}
@Component({
  selector: 'tf-status',
  templateUrl: './estado.html',

  styleUrl: './estado.scss',
})
export class Status {
  readonly value = input<unknown>('');
  label() {
    return humanize(this.value());
  }
  positive() {
    return ['PUBLICADA', 'ACEPTADO', 'COMPLETADA', 'CONFIRMADA', 'EVALUADO'].includes(
      String(this.value()),
    );
  }
}
