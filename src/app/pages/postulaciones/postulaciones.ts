import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { finalize, switchMap } from 'rxjs';
import { AuthStore } from '../../services/auth.service';
import { TalentApi } from '../../services/talent-api.service';
import { PostulacionDTO } from '../../models/postulacion';
import { VacanteDTO } from '../../models/vacante';
import { errorMessage } from '../../interceptors/auth.interceptor';
import { AsyncState } from '../../components/estado-carga/estado-carga';
import { Status } from '../../components/estado/estado';
@Component({
  imports: [FormsModule, RouterLink, DatePipe, AsyncState, Status],
  templateUrl: './postulaciones.html',
  styleUrl: './postulaciones.scss',
})
export class Applications {
  readonly auth = inject(AuthStore);
  private readonly api = inject(TalentApi);
  private readonly route = inject(ActivatedRoute);
  readonly vacancies = signal<VacanteDTO[]>([]);
  readonly vacancyId = signal(Number(this.route.snapshot.queryParamMap.get('vacante')) || 0);
  readonly rows = signal<PostulacionDTO[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly query = signal('');
  readonly page = signal(1);
  readonly hasMore = signal(false);
  private readonly pageSize = 15;
  /** ¿Está activo el modo "todas las postulaciones paginadas"?
   *  Solo para COORDINADOR / ADMINISTRADOR sin filtro de vacante seleccionado */
  private get useServerPage(): boolean {
    const role = this.auth.role();
    return (role === 'COORDINADOR' || role === 'ADMINISTRADOR') && !this.vacancyId();
  }
  readonly filtered = computed(() =>
    this.rows().filter((r) =>
      [r.postulanteNombre, r.vacanteTitulo]
        .join(' ')
        .toLowerCase()
        .includes(this.query().toLowerCase()),
    ),
  );
  constructor() {
    this.load();
  }
  load() {
    if (this.auth.role() === 'POSTULANTE') {
      this.loading.set(true);
      this.error.set('');
      this.api
        .profile(this.auth.session()!.usuarioId!)
        .pipe(
          switchMap((p) => this.api.applications('postulante', p.id!)),
          finalize(() => this.loading.set(false)),
        )
        .subscribe({
          next: (r) => this.rows.set(r),
          error: (e) => this.error.set(errorMessage(e)),
        });
    } else if (this.auth.role() === 'EVALUADOR') {
      this.loadScoped();
    } else if (this.useServerPage) {
      // COORDINADOR / ADMINISTRADOR sin vacante seleccionada → paginación server-side
      this.loadAllPaged();
    } else {
      // RECLUTADOR (o coord/admin con vacante ya seleccionada) → carga lista de vacantes
      this.loading.set(true);
      this.error.set('');
      this.api
        .vacancies()
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe({
          next: (v) => {
            this.vacancies.set(
              v.filter(
                (x) =>
                  this.auth.role() !== 'RECLUTADOR' ||
                  x.reclutadorId === this.auth.session()!.usuarioId,
              ),
            );
            if (this.vacancyId()) this.loadScoped();
          },
          error: (e) => this.error.set(errorMessage(e)),
        });
    }
  }
  /** Carga todas las postulaciones paginadas desde el servidor (COORDINADOR / ADMIN) */
  loadAllPaged() {
    this.loading.set(true);
    this.error.set('');
    this.api.client
      .get<PostulacionDTO[]>('/postulaciones', { page: this.page() - 1, size: this.pageSize })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (r) => {
          this.rows.set(r);
          this.hasMore.set(r.length === this.pageSize);
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  loadScoped() {
    this.rows.set([]);
    this.page.set(1);
    if (!this.vacancyId() && this.auth.role() !== 'EVALUADOR') return;
    this.loading.set(true);
    this.error.set('');
    this.api
      .applications(
        this.auth.role() === 'EVALUADOR' ? 'evaluador' : 'vacante',
        this.auth.role() === 'EVALUADOR' ? this.auth.session()!.usuarioId! : this.vacancyId(),
      )
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (r) => this.rows.set(r), error: (e) => this.error.set(errorMessage(e)) });
  }
  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadAllPaged();
    }
  }
  nextPage() {
    if (this.hasMore()) {
      this.page.update((p) => p + 1);
      this.loadAllPaged();
    }
  }
}
