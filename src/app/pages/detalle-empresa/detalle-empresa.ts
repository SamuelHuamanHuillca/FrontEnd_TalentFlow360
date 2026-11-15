import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { COMPANIES } from '../../data/empresas.data';
import { CompanyLogo } from '../../components/logo-empresa/logo-empresa';
import { CompanyVacancies } from '../../services/empresas.service';
import { PublicHeader } from '../../components/cabecera/cabecera';
import { Footer } from '../../components/footer/footer';
import { Icon } from '../../components/icono/icono';
import { Status } from '../../components/estado/estado';
@Component({
  imports: [RouterLink, CompanyLogo, PublicHeader, Footer, Icon, Status],
  templateUrl: './detalle-empresa.html',
  styleUrl: './detalle-empresa.scss',
})
export class CompanyDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly company = computed(() => COMPANIES.find((c) => c.slug === this.params().get('slug')));
  readonly vacancies = inject(CompanyVacancies);
}
