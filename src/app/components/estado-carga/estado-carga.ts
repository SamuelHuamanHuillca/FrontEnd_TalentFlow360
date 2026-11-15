import { Component, input, output } from '@angular/core';
@Component({
  selector: 'tf-async-state',
  templateUrl: './estado-carga.html',

  styleUrl: './estado-carga.scss',
})
export class AsyncState {
  readonly loading = input(false);
  readonly error = input('');
  readonly retry = output<void>();
}
