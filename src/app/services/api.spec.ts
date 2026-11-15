import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { authInterceptor, errorMessage } from '../interceptors/auth.interceptor';
import { ApiClient } from './api-client.service';
import { ApiConfig } from './api-config.service';
import { TalentApi } from './talent-api.service';
import { AuthStore } from './auth.service';
describe('Contrato HTTP y aislamiento del token', () => {
  let http: HttpTestingController;
  let api: TalentApi;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: Router,
          useValue: { navigate: vi.fn().mockResolvedValue(true), url: '/app/inicio' },
        },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
    api = TestBed.inject(TalentApi);
  });
  afterEach(() => http.verify());
  const respond = (data: unknown) => ({
    success: true,
    message: 'OK',
    data,
    timestamp: '2026-11-14T09:00:00',
  });
  function login() {
    TestBed.inject(AuthStore).set({
      token: 'a.' + btoa(JSON.stringify({ exp: Date.now() / 1000 + 600 })) + '.b',
      usuarioId: 1,
      rol: 'POSTULANTE',
    });
  }
  it('desenvuelve data del contrato ApiResponse', () => {
    let value: unknown;
    api.vacancies().subscribe((v) => (value = v));
    http.expectOne('/api/vacantes').flush(respond([{ id: 1 }]));
    expect(value).toEqual([{ id: 1 }]);
  });
  it('adjunta Bearer únicamente al backend configurado', () => {
    login();
    api.vacancy(2).subscribe();
    const req = http.expectOne('/api/vacantes/2');
    expect(req.request.headers.get('Authorization')).toMatch(/^Bearer /);
    req.flush(respond({ id: 2 }));
  });
  it('no filtra el token a dominios externos', () => {
    login();
    TestBed.inject(HttpClient).get('https://example.org/api/else').subscribe();
    const req = http.expectOne('https://example.org/api/else');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
  it('no agrega token al login', () => {
    login();
    api.login({ email: 'test@example.test', password: 'password' }).subscribe();
    const req = http.expectOne('/api/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush(respond({}));
  });
  it('usa solo la ruta de feedback visible para postulantes', () => {
    api.feedback(5, true).subscribe();
    http.expectOne('/api/evaluaciones/retroalimentacion/postulacion/5/visible').flush(respond([]));
  });
  it('preserva el método PATCH y sus parámetros', () => {
    TestBed.inject(ApiClient)
      .patch('/postulaciones/6/estado', { nuevoEstado: 'EN_REVISION' }, { usuarioId: 3 })
      .subscribe();
    const req = http.expectOne('/api/postulaciones/6/estado?usuarioId=3');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ nuevoEstado: 'EN_REVISION' });
    req.flush(respond({}));
  });
  it('una respuesta fallida de negocio propaga un error', () => {
    let error = '';
    api.vacancies().subscribe({ error: (e) => (error = e.message) });
    http.expectOne('/api/vacantes').flush({ success: false, message: 'Regla rechazada' });
    expect(error).toBe('Regla rechazada');
  });
  it('un 401 en un recurso cierra la sesión', () => {
    login();
    api.vacancies().subscribe({ error: () => {} });
    http.expectOne('/api/vacantes').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(TestBed.inject(AuthStore).session()).toBeNull();
  });
  it('un 403 no borra una sesión con permisos diferentes', () => {
    login();
    api.dashboard().subscribe({ error: () => {} });
    http.expectOne('/api/dashboard').flush({}, { status: 403, statusText: 'Forbidden' });
    expect(TestBed.inject(AuthStore).valid()).toBe(true);
  });
  it('un prefijo parecido no pertenece a la API', () => {
    expect(TestBed.inject(ApiConfig).owns('/api-other/private')).toBe(false);
  });
  it('explica conflictos con el mensaje del servidor', () =>
    expect(
      errorMessage(
        new HttpErrorResponse({
          status: 409,
          error: { message: 'El evaluador ya tiene una entrevista' },
        }),
      ),
    ).toContain('ya tiene una entrevista'));
  it('explica errores de red', () =>
    expect(errorMessage(new HttpErrorResponse({ status: 0 }))).toContain('conectar'));
  it('no consulta el detalle de una postulación ajena al postulante', () => {
    login();
    let message = '';
    api.authorizedApplication(99).subscribe({ error: (e) => (message = e.message) });
    http.expectOne('/api/postulantes/usuario/1').flush(respond({ id: 3 }));
    http.expectOne('/api/postulaciones/postulante/3').flush(respond([{ id: 21 }]));
    http.expectNone('/api/postulaciones/99');
    expect(message).toContain('ámbito de acceso');
  });
  it('el evaluador consulta sus asignaciones antes del detalle', () => {
    TestBed.inject(AuthStore).set({
      token: 'a.' + btoa(JSON.stringify({ exp: Date.now() / 1000 + 600 })) + '.b',
      usuarioId: 7,
      rol: 'EVALUADOR',
    });
    api.authorizedApplication(21).subscribe();
    http.expectOne('/api/postulaciones/evaluador/7').flush(respond([{ id: 21 }]));
    http.expectOne('/api/postulaciones/21').flush(respond({ id: 21 }));
  });
  it('el reclutador no presenta una postulación de otra vacante', () => {
    TestBed.inject(AuthStore).set({
      token: 'a.' + btoa(JSON.stringify({ exp: Date.now() / 1000 + 600 })) + '.b',
      usuarioId: 2,
      rol: 'RECLUTADOR',
    });
    let message = '';
    api.authorizedApplication(21).subscribe({ error: (e) => (message = e.message) });
    http.expectOne('/api/postulaciones/21').flush(respond({ id: 21, vacanteId: 11 }));
    http.expectOne('/api/vacantes/11').flush(respond({ id: 11, reclutadorId: 8 }));
    expect(message).toContain('ámbito de acceso');
  });
});
