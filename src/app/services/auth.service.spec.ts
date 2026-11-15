import { AuthStore, jwtExpiry } from './auth.service';
import { safeReturnUrl } from '../guards/auth.guard';
import { TRANSITIONS } from '../data/estados-postulacion.data';
const token = (exp: number) => 'header.' + btoa(JSON.stringify({ exp })) + '.signature';
describe('Sesión JWT y permisos', () => {
  it('rechaza tokens malformados', () => expect(jwtExpiry('invalid')).toBe(0));
  it('lee la expiración en milisegundos', () => expect(jwtExpiry(token(200))).toBe(200000));
  it('no autentica al iniciar', () => expect(new AuthStore().valid()).toBe(false));
  it('rechaza una sesión vencida', () =>
    expect(() =>
      new AuthStore().set({ token: token(1), usuarioId: 1, rol: 'POSTULANTE' }),
    ).toThrow());
  it('conserva el rol del servidor y limita el acceso', () => {
    const s = new AuthStore();
    s.set({ token: token(Date.now() / 1000 + 600), usuarioId: 4, rol: 'EVALUADOR' });
    expect(s.has(['EVALUADOR'])).toBe(true);
    expect(s.has(['ADMINISTRADOR'])).toBe(false);
  });
  it('cerrar sesión elimina el token', () => {
    const s = new AuthStore();
    s.set({ token: token(Date.now() / 1000 + 600), usuarioId: 1, rol: 'POSTULANTE' });
    s.clear();
    expect(s.session()).toBeNull();
    expect(s.valid()).toBe(false);
  });
  it('volver a comprobar detecta expiración sin otra petición', () => {
    const s = new AuthStore();
    const now = Date.now();
    s.set({ token: token(now / 1000 + 5), usuarioId: 1, rol: 'POSTULANTE' });
    vi.spyOn(Date, 'now').mockReturnValue(now + 6000);
    expect(s.valid()).toBe(false);
    vi.restoreAllMocks();
  });
  it.each(['https://evil.example', '//evil.example', '/app/https://evil.example', null])(
    'evita redirecciones externas: %s',
    (value) => expect(safeReturnUrl(value)).toBe('/app/inicio'),
  );
  it('conserva una ruta de retorno interna', () =>
    expect(safeReturnUrl('/app/postulaciones/3')).toBe('/app/postulaciones/3'));
  it.each(['ACEPTADO', 'RECHAZADO', 'CANCELADO'] as const)(
    'no propone cambios desde estado final %s',
    (state) => expect(TRANSITIONS[state]).toEqual([]),
  );
  it('no permite pasar directamente de pendiente a aceptado', () =>
    expect(TRANSITIONS.PENDIENTE_REVISION).not.toContain('ACEPTADO'));
});
