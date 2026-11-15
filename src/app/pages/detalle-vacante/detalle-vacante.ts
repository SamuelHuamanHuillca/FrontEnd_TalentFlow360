import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { finalize, switchMap } from 'rxjs';
import { TalentApi } from '../../services/talent-api.service';
import { PostulacionDTO } from '../../models/postulacion';
import { VacanteDTO } from '../../models/vacante';
import { AuthStore, RECRUITERS } from '../../services/auth.service';
import { NoticeStore } from '../../services/avisos.service';
import { errorMessage } from '../../interceptors/auth.interceptor';
import { AsyncState } from '../../components/estado-carga/estado-carga';
import { Status } from '../../components/estado/estado';
@Component({
  imports: [RouterLink, DatePipe, AsyncState, Status],
  templateUrl: './detalle-vacante.html',
  styleUrl: './detalle-vacante.scss',
})
export class VacancyDetail {
  readonly api = inject(TalentApi);
  readonly auth = inject(AuthStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notice = inject(NoticeStore);
  readonly recruiters = RECRUITERS;
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly job = signal<VacanteDTO | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly actionError = signal('');
  readonly busy = signal(false);
  readonly confirmClose = signal(false);
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api
      .vacancy(this.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (j) => this.job.set(j), error: (e) => this.error.set(errorMessage(e)) });
  }
  apply() {
    if (this.busy()) return;
    this.busy.set(true);
    this.actionError.set('');
    this.api
      .profile(this.auth.session()!.usuarioId!)
      .pipe(
        switchMap((p) =>
          this.api.client.post<PostulacionDTO>(
            '/postulaciones/postulante/' + p.id + '/vacante/' + this.id,
          ),
        ),
        finalize(() => this.busy.set(false)),
      )
      .subscribe({
        next: (a) => {
          this.notice.show('Tu postulación fue enviada. Ya puedes consultar el matching.');
          void this.router.navigate(['/app/postulaciones', a.id]);
        },
        error: (e) => this.actionError.set(errorMessage(e)),
      });
  }
  change(action: 'publicar' | 'cerrar') {
    this.busy.set(true);
    this.actionError.set('');
    this.api.client
      .patch<VacanteDTO>('/vacantes/' + this.id + '/' + action)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (j) => {
          this.job.set(j);
          this.confirmClose.set(false);
          this.notice.show(action === 'publicar' ? 'Vacante publicada.' : 'Vacante cerrada.');
        },
        error: (e) => this.actionError.set(errorMessage(e)),
      });
  }
}
