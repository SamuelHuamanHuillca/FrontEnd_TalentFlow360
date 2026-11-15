import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Brand } from '../marca/marca';
import { Icon } from '../icono/icono';
import {
  OpportunitySearch,
  OpportunityQuery,
} from '../buscador-oportunidades/buscador-oportunidades';
import { AuthStore } from '../../services/auth.service';
@Component({
  selector: 'tf-public-header',
  imports: [RouterLink, Brand, Icon, OpportunitySearch],
  templateUrl: './cabecera.html',
  styleUrl: './cabecera.scss',
})
export class PublicHeader {
  readonly compactSearch = input(false);
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  search(q: OpportunityQuery) {
    void this.router.navigate(['/app/vacantes'], {
      queryParams: { q: q.query, ubicacion: q.location },
    });
  }
}
