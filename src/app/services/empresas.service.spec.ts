import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthStore } from './auth.service';
import { CompanyVacancies } from './empresas.service';
import { COMPANIES } from '../data/empresas.data';
describe('Vacantes verificadas del directorio', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  function login() {
    TestBed.inject(AuthStore).set({
      token: 'a.' + btoa(JSON.stringify({ exp: Date.now() / 1000 + 600 })) + '.b',
      usuarioId: 1,
      rol: 'POSTULANTE',
    });
  }
  it('no consulta recursos privados antes de ingresar ni muestra un cero ficticio', () => {
    const service = TestBed.inject(CompanyVacancies);
    TestBed.tick();
    http.expectNone('/api/vacantes');
    expect(service.count(COMPANIES[0])).toBeNull();
  });
  it('cuenta únicamente vacantes publicadas de la empresa correspondiente', () => {
    login();
    const service = TestBed.inject(CompanyVacancies);
    TestBed.tick();
    http.expectOne('/api/vacantes').flush({
      success: true,
      data: [
        { id: 1, empresa: 'Alicorp S.A.A.', estado: 'PUBLICADA' },
        { id: 2, empresa: 'Alicorp', estado: 'BORRADOR' },
        { id: 3, empresa: 'Gloria', estado: 'PUBLICADA' },
      ],
    });
    expect(service.count(COMPANIES[0])).toBe(1);
    expect(service.count(COMPANIES[1])).toBe(0);
  });
  it('un error de API no se convierte en ausencia de vacantes', () => {
    login();
    const service = TestBed.inject(CompanyVacancies);
    TestBed.tick();
    http.expectOne('/api/vacantes').flush({}, { status: 500, statusText: 'Error' });
    expect(service.count(COMPANIES[0])).toBeNull();
    expect(service.error()).not.toBe('');
  });
  it('limpia los resultados privados al cerrar sesión', () => {
    login();
    const service = TestBed.inject(CompanyVacancies);
    TestBed.tick();
    http
      .expectOne('/api/vacantes')
      .flush({ success: true, data: [{ id: 1, empresa: 'Alicorp', estado: 'PUBLICADA' }] });
    TestBed.inject(AuthStore).clear();
    TestBed.tick();
    expect(service.count(COMPANIES[0])).toBeNull();
    expect(service.jobs()).toBeNull();
  });
});
