import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'tf-brand',
  imports: [RouterLink],
  templateUrl: './marca.html',
  styleUrl: './marca.scss',
})
export class Brand {
  readonly link = input('/');
}
