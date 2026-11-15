import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthStore, REVIEWERS } from '../../services/auth.service';
import { TalentApi } from '../../services/talent-api.service';
import { EvaluacionDTO } from '../../models/evaluacion';
import { NoticeStore } from '../../services/avisos.service';
import { errorMessage } from '../../interceptors/auth.interceptor';
import { AsyncState } from '../../components/estado-carga/estado-carga';
import { DataForm, Field, FormValue } from '../../components/formulario/formulario';
import { ArrayEditor } from '../../components/editor-lista/editor-lista';
@Component({
  imports: [FormsModule, DatePipe, AsyncState, DataForm, ArrayEditor],
  templateUrl: './evaluaciones.html',

  styleUrl: './evaluaciones.scss',
})
export class Evaluations {
  readonly auth = inject(AuthStore);
  private readonly api = inject(TalentApi);
  private readonly notice = inject(NoticeStore);
  private readonly route = inject(ActivatedRoute);
  readonly reviewers = REVIEWERS;
  scope = this.route.snapshot.queryParamMap.has('postulacion') ? 'postulacion' : 'evaluador';
  lookupId =
    Number(this.route.snapshot.queryParamMap.get('postulacion')) || this.auth.session()!.usuarioId!;
  readonly rows = signal<EvaluacionDTO[]>([]);
  readonly loading = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly actionError = signal('');
  readonly criteria = signal<FormValue[]>([]);
  readonly criteriaFields: Field[] = [
    { key: 'nombre', label: 'Criterio profesional', required: true, maxLength: 100 },
    { key: 'puntaje', label: 'Puntaje obtenido', type: 'number', required: true, min: 0, max: 100 },
    {
      key: 'puntajeMaximo',
      label: 'Puntaje máximo',
      type: 'number',
      required: true,
      min: 1,
      max: 100,
      value: 100,
    },
    { key: 'comentario', label: 'Justificación', type: 'textarea', required: true, maxLength: 500 },
  ];
  readonly evaluationFields: Field[] = [
    {
      key: 'postulacionId',
      label: 'ID de postulación',
      type: 'number',
      required: true,
      min: 1,
      value: Number(this.route.snapshot.queryParamMap.get('postulacion')) || '',
    },
    { key: 'entrevistaId', label: 'ID de entrevista (opcional)', type: 'number', min: 1 },
    {
      key: 'puntajeGeneral',
      label: 'Puntaje general (0 a 100)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
    },
    { key: 'comentarios', label: 'Comentarios', type: 'textarea', required: true, maxLength: 1000 },
  ];
  readonly feedbackFields: Field[] = [
    {
      key: 'postulacionId',
      label: 'ID de postulación',
      type: 'number',
      required: true,
      min: 1,
      value: Number(this.route.snapshot.queryParamMap.get('postulacion')) || '',
    },
    {
      key: 'contenido',
      label: 'Retroalimentación',
      type: 'textarea',
      required: true,
      minLength: 5,
      maxLength: 2000,
    },
    { key: 'visiblePostulante', label: 'Visible para el postulante', type: 'checkbox' },
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
      .get<EvaluacionDTO[]>('/evaluaciones/' + this.scope + '/' + this.lookupId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (r) => this.rows.set(r), error: (e) => this.error.set(errorMessage(e)) });
  }
  evaluate(v: FormValue) {
    if (
      !this.criteria().length ||
      this.criteria().some((c) => Number(c['puntaje']) > Number(c['puntajeMaximo']))
    ) {
      this.actionError.set(
        'Agrega criterios válidos: el puntaje obtenido no puede superar el máximo.',
      );
      return;
    }
    this.save('/evaluaciones/evaluador/' + this.auth.session()!.usuarioId, {
      ...v,
      entrevistaId: v['entrevistaId'] || null,
      criterios: this.criteria(),
    });
  }
  feedback(v: FormValue) {
    this.save('/evaluaciones/retroalimentacion/evaluador/' + this.auth.session()!.usuarioId, v);
  }
  private save(path: string, body: unknown) {
    this.busy.set(true);
    this.actionError.set('');
    this.api.client
      .post(path, body)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.notice.show('Registro guardado correctamente.');
          this.load();
        },
        error: (e) => this.actionError.set(errorMessage(e)),
      });
  }
}
