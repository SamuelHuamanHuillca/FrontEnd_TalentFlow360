import { Injectable, inject } from '@angular/core';
import { switchMap, throwError, of } from 'rxjs';
import { AuthStore } from './auth.service';
import { ApiClient } from './api-client.service';
import * as M from '../models/index';
@Injectable({ providedIn: 'root' })
export class TalentApi {
  readonly client = inject(ApiClient);
  private readonly auth = inject(AuthStore);
  login(body: { email: string; password: string }) {
    return this.client.post<M.AuthResponseDTO>('/auth/login', body);
  }
  register(body: unknown) {
    return this.client.post<M.UsuarioDTO>('/auth/registro', body);
  }
  vacancies() {
    return this.client.get<M.VacanteDTO[]>('/vacantes');
  }
  vacancy(id: number) {
    return this.client.get<M.VacanteDTO>('/vacantes/' + id);
  }
  profile(userId: number) {
    return this.client.get<M.PostulanteDTO>('/postulantes/usuario/' + userId);
  }
  applications(scope: 'postulante' | 'vacante' | 'evaluador', id: number) {
    return this.client.get<M.PostulacionDTO[]>('/postulaciones/' + scope + '/' + id);
  }
  application(id: number) {
    return this.client.get<M.PostulacionDTO>('/postulaciones/' + id);
  }
  authorizedApplication(id: number) {
    const session = this.auth.session()!;
    const denied = () =>
      throwError(() => new Error('Esta postulación no pertenece a tu ámbito de acceso.'));
    if (session.rol === 'POSTULANTE')
      return this.profile(session.usuarioId!).pipe(
        switchMap((p) => this.applications('postulante', p.id!)),
        switchMap((rows) => (rows.some((r) => r.id === id) ? this.application(id) : denied())),
      );
    if (session.rol === 'EVALUADOR')
      return this.applications('evaluador', session.usuarioId!).pipe(
        switchMap((rows) => (rows.some((r) => r.id === id) ? this.application(id) : denied())),
      );
    if (session.rol === 'RECLUTADOR')
      return this.application(id).pipe(
        switchMap((a) =>
          this.vacancy(a.vacanteId!).pipe(
            switchMap((v) => (v.reclutadorId === session.usuarioId ? of(a) : denied())),
          ),
        ),
      );
    return this.application(id);
  }
  history(id: number) {
    return this.client.get<M.HistorialEstadoDTO[]>('/postulaciones/' + id + '/historial');
  }
  matching(id: number) {
    return this.client.get<M.DetalleMatchingDTO[]>('/postulaciones/' + id + '/matching');
  }
  feedback(id: number, visible: boolean) {
    return this.client.get<M.RetroalimentacionDTO[]>(
      '/evaluaciones/retroalimentacion/postulacion/' + id + (visible ? '/visible' : ''),
    );
  }
  dashboard() {
    return this.client.get<M.DashboardDTO>('/dashboard');
  }
  auditEvents(page?: number, size?: number) {
    const params = page !== undefined && size !== undefined ? { page, size } : undefined;
    return this.client.get<M.AuditoriaEventoDTO[]>('/auditoria', params);
  }
}
