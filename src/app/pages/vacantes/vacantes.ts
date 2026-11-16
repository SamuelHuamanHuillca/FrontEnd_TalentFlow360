import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { TalentApi } from '../../services/talent-api.service';
import { VacanteDTO } from '../../models/vacante';
import { AuthStore, RECRUITERS } from '../../services/auth.service';
import { errorMessage } from '../../interceptors/auth.interceptor';
import { AsyncState } from '../../components/estado-carga/estado-carga';
import { Icon } from '../../components/icono/icono';
import { Status } from '../../components/estado/estado';
@Component({
  imports: [RouterLink, FormsModule, AsyncState, Icon, Status],
  templateUrl: './vacantes.html',
  styleUrl: './vacantes.scss',
})
export class Vacancies {
  readonly api = inject(TalentApi);
  readonly auth = inject(AuthStore);
  readonly recruiters = RECRUITERS;
  readonly jobs = signal<VacanteDTO[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  private readonly route = inject(ActivatedRoute);
  readonly query = signal(this.route.snapshot.queryParamMap.get('q') ?? '');
  readonly location = signal(this.route.snapshot.queryParamMap.get('ubicacion') ?? '');
  readonly mode = signal('');
  readonly state = signal('');
  readonly page = signal(1);
  readonly hasMore = signal(false);
  private readonly pageSize = 9;
  /** Filtros client-side sobre la página actual ya cargada desde el servidor */
  readonly filtered = computed(() =>
    this.jobs().filter(
      (v) =>
        (this.auth.role() !== 'POSTULANTE' || v.estado === 'PUBLICADA') &&
        (!this.mode() || v.modalidad === this.mode()) &&
        (!this.location() ||
          (v.ubicacion ?? '').toLowerCase().includes(this.location().toLowerCase())) &&
        (!this.state() || v.estado === this.state()) &&
        [v.titulo, v.empresa, v.ubicacion]
          .join(' ')
          .toLocaleLowerCase()
          .includes(this.query().toLocaleLowerCase()),
    ),
  );
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.client
      .get<VacanteDTO[]>('/vacantes', { page: this.page() - 1, size: this.pageSize })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (v) => {
          this.jobs.set(v);
          this.hasMore.set(v.length === this.pageSize);
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  /** Aplica un filtro nuevo → vuelve al inicio */
  reset() {
    this.page.set(1);
    this.load();
  }
  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.load();
    }
  }
  nextPage() {
    if (this.hasMore()) {
      this.page.update((p) => p + 1);
      this.load();
    }
  }
}
