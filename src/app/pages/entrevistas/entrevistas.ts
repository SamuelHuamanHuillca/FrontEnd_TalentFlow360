import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthStore, RECRUITERS } from '../../services/auth.service';
import { TalentApi } from '../../services/talent-api.service';
import { EntrevistaDTO, EstadoEntrevista } from '../../models/entrevista';
import { errorMessage } from '../../interceptors/auth.interceptor';
import { NoticeStore } from '../../services/avisos.service';
import { DataForm, Field, FormValue } from '../../components/formulario/formulario';
import { AsyncState } from '../../components/estado-carga/estado-carga';
import { Status } from '../../components/estado/estado';
@Component({
  imports: [DatePipe, FormsModule, DataForm, AsyncState, Status],
  templateUrl: './entrevistas.html',

  styleUrl: './entrevistas.scss',
})
export class Interviews {
  readonly auth = inject(AuthStore);
  private readonly api = inject(TalentApi);
  private readonly route = inject(ActivatedRoute);
  private readonly notice = inject(NoticeStore);
  readonly recruiters = RECRUITERS;
  readonly scope = signal(
    this.route.snapshot.queryParamMap.has('postulacion') ? 'postulacion' : 'evaluador',
  );
  lookupId =
    Number(this.route.snapshot.queryParamMap.get('postulacion')) || this.auth.session()!.usuarioId!;
  readonly rows = signal<EntrevistaDTO[]>([]);
  readonly loading = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly actionError = signal('');
  readonly states: EstadoEntrevista[] = [
    'PROGRAMADA',
    'CONFIRMADA',
    'EN_CURSO',
    'COMPLETADA',
    'CANCELADA',
    'NO_ASISTIO',
  ];
  readonly fields: Field[] = [
    {
      key: 'postulacionId',
      label: 'ID de postulación',
      type: 'number',
      required: true,
      min: 1,
      value: Number(this.route.snapshot.queryParamMap.get('postulacion')) || '',
    },
    { key: 'evaluadorId', label: 'ID del evaluador', type: 'number', required: true, min: 1 },
    {
      key: 'fechaHoraInicio',
      label: 'Inicio de entrevista',
      type: 'datetime-local',
      required: true,
    },
    { key: 'fechaHoraFin', label: 'Fin de entrevista', type: 'datetime-local', required: true },
    { key: 'tipo', label: 'Tipo', options: ['VIRTUAL', 'PRESENCIAL'], required: true },
    { key: 'ubicacionOEnlace', label: 'Ubicación o enlace', required: true, maxLength: 300 },
    { key: 'notas', label: 'Notas', type: 'textarea', maxLength: 1000 },
  ];
  constructor() {
    this.load();
  }
  load() {
    if (!(this.lookupId > 0)) {
      this.error.set('Introduce un ID válido.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.api.client
      .get<EntrevistaDTO[]>('/entrevistas/' + this.scope() + '/' + this.lookupId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (r) => this.rows.set(r), error: (e) => this.error.set(errorMessage(e)) });
  }
  schedule(v: FormValue) {
    if (String(v['fechaHoraFin']) <= String(v['fechaHoraInicio'])) {
      this.actionError.set('El fin de la entrevista debe ser posterior al inicio.');
      return;
    }
    this.busy.set(true);
    this.actionError.set('');
    this.api.client
      .post<EntrevistaDTO>('/entrevistas', v)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.notice.show('Entrevista agendada sin conflictos.');
          this.scope.set('postulacion');
          this.lookupId = Number(v['postulacionId']);
          this.load();
        },
        error: (e) => this.actionError.set(errorMessage(e)),
      });
  }
  update(id: number, state: EstadoEntrevista) {
    this.api.client
      .patch<EntrevistaDTO>('/entrevistas/' + id + '/estado', {}, { estado: state })
      .subscribe({
        next: () => {
          this.notice.show('Estado de entrevista actualizado.');
          this.load();
        },
        error: (e) => {
          this.actionError.set(errorMessage(e));
          this.load();
        },
      });
  }
}
