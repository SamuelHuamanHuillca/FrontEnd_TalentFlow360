import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  imports: [RouterLink],
  templateUrl: './no-encontrado.html',

  styleUrl: './no-encontrado.scss',
})
export class ErrorPage {
  readonly forbidden = inject(ActivatedRoute).snapshot.data['forbidden'] === true;
}
