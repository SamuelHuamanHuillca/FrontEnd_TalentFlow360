import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PublicHeader } from '../../components/cabecera/cabecera';
import { CompanyCarousel } from '../../components/carrusel-empresas/carrusel-empresas';
import { Footer } from '../../components/footer/footer';
import { Icon } from '../../components/icono/icono';
import { CategoryLinks } from '../../components/categorias/categorias';
import {
  OpportunitySearch,
  OpportunityQuery,
} from '../../components/buscador-oportunidades/buscador-oportunidades';
@Component({
  imports: [
    RouterLink,
    PublicHeader,
    CompanyCarousel,
    Footer,
    Icon,
    CategoryLinks,
    OpportunitySearch,
  ],
  templateUrl: './portada.html',
  styleUrl: './portada.scss',
})
export class Welcome {
  private readonly router = inject(Router);
  search(q: OpportunityQuery) {
    void this.router.navigate(['/app/vacantes'], {
      queryParams: { q: q.query, ubicacion: q.location },
    });
  }
}
