import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Brand } from '../marca/marca';
@Component({
  selector: 'tf-footer',
  imports: [RouterLink, Brand],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly year = new Date().getFullYear();
}
