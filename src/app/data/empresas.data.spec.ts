import { COMPANIES, belongsToCompany, normalizeCompany } from './empresas.data';
import { safeReturnUrl } from '../guards/auth.guard';
describe('Directorio y correspondencia de empresas', () => {
  it('no duplica fichas ni usa logos de dominios externos en runtime', () => {
    expect(new Set(COMPANIES.map((c) => c.slug)).size).toBe(COMPANIES.length);
    expect(
      COMPANIES.every(
        (c) => c.logo.startsWith('/images/companies/') && c.website.startsWith('https://'),
      ),
    ).toBe(true);
  });
  it('reconoce alias de razón social y diferencias de mayúsculas', () =>
    expect(belongsToCompany(COMPANIES[0], 'ALICORP S.A.A.')).toBe(true));
  it('no atribuye una vacante a una empresa por coincidencia parcial', () =>
    expect(belongsToCompany(COMPANIES[2], 'Gloria Foods Consultores')).toBe(false));
  it('no atribuye registros sin empresa', () =>
    expect(belongsToCompany(COMPANIES[0], undefined)).toBe(false));
  it('permite búsqueda sin tildes', () =>
    expect(normalizeCompany('Construcción')).toBe('construccion'));
  it('conserva el retorno al perfil público tras iniciar sesión', () =>
    expect(safeReturnUrl('/empresas/alicorp')).toBe('/empresas/alicorp'));
  it('no convierte una ruta externa en retorno del directorio', () =>
    expect(safeReturnUrl('/empresas//example.org')).toBe('/app/inicio'));
});
