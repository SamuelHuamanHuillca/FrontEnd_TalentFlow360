import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { AuthStore, STAFF } from '../../services/auth.service';
import { TalentApi } from '../../services/talent-api.service';
import {
  DetalleMatchingDTO,
  HistorialEstadoDTO,
  PostulacionDTO,
  EstadoPostulacion,
} from '../../models/postulacion';
import { RetroalimentacionDTO } from '../../models/evaluacion';
import { TRANSITIONS } from '../../data/estados-postulacion.data';
import { errorMessage } from '../../interceptors/auth.interceptor';
import { NoticeStore } from '../../services/avisos.service';
import { AsyncState } from '../../components/estado-carga/estado-carga';
import { Status } from '../../components/estado/estado';
import { DataForm, Field, FormValue } from '../../components/formulario/formulario';
@Component({
  imports: [RouterLink, DatePipe, DecimalPipe, AsyncState, Status, DataForm],
  templateUrl: './detalle-postulacion.html',

  styleUrl: './detalle-postulacion.scss',
})
export class ApplicationDetail {
  readonly auth = inject(AuthStore);
  private readonly api = inject(TalentApi);
  private readonly route = inject(ActivatedRoute);
  private readonly notice = inject(NoticeStore);
  readonly staff = STAFF;
  readonly id = Number(this.route.snapshot.paramMap.get('id'));
  readonly data = signal<PostulacionDTO | null>(null);
  readonly matching = signal<DetalleMatchingDTO[]>([]);
  readonly history = signal<HistorialEstadoDTO[]>([]);
  readonly feedback = signal<RetroalimentacionDTO[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly secondaryError = signal('');
  readonly actionError = signal('');
  readonly busy = signal(false);
  readonly fields = signal<Field[]>([]);
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.secondaryError.set('');
    this.api
      .authorizedApplication(this.id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (d) => {
          this.data.set(d);
          this.fields.set([
            {
              key: 'nuevoEstado',
              label: 'Siguiente estado',
              required: true,
              options: TRANSITIONS[d.estado!],
            },
            {
              key: 'motivo',
              label: 'Motivo del cambio',
              type: 'textarea',
              required: true,
              minLength: 5,
              maxLength: 500,
            },
          ]);
          this.loadDetails();
        },
        error: (e) => this.error.set(errorMessage(e)),
      });
  }
  private loadDetails() {
    const safe = <T>(req: import('rxjs').Observable<T[]>) =>
      req.pipe(
        catchError((e) => {
          this.secondaryError.set(errorMessage(e));
          return of([] as T[]);
        }),
      );
    forkJoin({
      matching: safe(this.api.matching(this.id)),
      history: safe(this.api.history(this.id)),
      feedback: safe(this.api.feedback(this.id, this.auth.role() === 'POSTULANTE')),
    }).subscribe((v) => {
      this.matching.set(v.matching);
      this.history.set(v.history);
      this.feedback.set(v.feedback);
    });
  }
  change(v: FormValue) {
    this.busy.set(true);
    this.actionError.set('');
    this.api.client
      .patch<PostulacionDTO>('/postulaciones/' + this.id + '/estado', v, {
        usuarioId: this.auth.session()!.usuarioId!,
      })
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.notice.show('El cambio y su motivo quedaron registrados.');
          this.load();
        },
        error: (e) => this.actionError.set(errorMessage(e)),
      });
  }
  hasTransitions() {
    return (
      !!this.data()?.estado && TRANSITIONS[this.data()!.estado as EstadoPostulacion].length > 0
    );
  }
}
