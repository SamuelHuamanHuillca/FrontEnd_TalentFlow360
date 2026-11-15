import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { COMPANIES, normalizeCompany } from '../../data/empresas.data';
import { CompanyLogo } from '../../components/logo-empresa/logo-empresa';
import { CompanyVacancies } from '../../services/empresas.service';
import { PublicHeader } from '../../components/cabecera/cabecera';
import { Footer } from '../../components/footer/footer';
import { Icon } from '../../components/icono/icono';
@Component({
  imports: [FormsModule, RouterLink, CompanyLogo, PublicHeader, Footer, Icon],
  templateUrl: './empresas.html',
  styleUrl: './empresas.scss',
})
export class CompaniesPage {
  readonly catalogue = COMPANIES;
  readonly vacancies = inject(CompanyVacancies);
  readonly query = signal('');
  readonly sector = signal('');
  readonly tab = signal<'all' | 'opportunities'>('all');
  readonly sort = signal('nombre');
  readonly sectors = [...new Set(COMPANIES.map((c) => c.sector))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
  readonly featured = COMPANIES.filter((c) => c.featured);
  readonly filtered = computed(() => {
    const q = normalizeCompany(this.query());
    return COMPANIES.filter(
      (c) =>
        (!this.sector() || c.sector === this.sector()) &&
        (!q || normalizeCompany(c.name + ' ' + c.sector + ' ' + c.description).includes(q)) &&
        (this.tab() !== 'opportunities' ||
          !this.vacancies.signedIn() ||
          (this.vacancies.count(c) !== null && this.vacancies.count(c)! > 0)),
    ).sort((a, b) =>
      this.sort() === 'sector'
        ? a.sector.localeCompare(b.sector, 'es') || a.name.localeCompare(b.name, 'es')
        : a.name.localeCompare(b.name, 'es'),
    );
  });
  reset() {
    this.query.set('');
    this.sector.set('');
    this.tab.set('all');
  }
}
