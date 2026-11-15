import { Component, input, output, signal } from '@angular/core';
import { DataForm, Field, FormValue } from '../formulario/formulario';
@Component({
  selector: 'tf-array-editor',
  imports: [DataForm],
  templateUrl: './editor-lista.html',

  styleUrl: './editor-lista.scss',
})
export class ArrayEditor {
  readonly fields = input.required<readonly Field[]>();
  readonly label = input('requisito');
  readonly changed = output<FormValue[]>();
  readonly items = signal<FormValue[]>([]);
  add(item: FormValue) {
    this.items.update((v) => [...v, item]);
    this.changed.emit(this.items());
  }
  remove(index: number) {
    this.items.update((v) => v.filter((_, i) => i !== index));
    this.changed.emit(this.items());
  }
}
