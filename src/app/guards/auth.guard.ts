import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { AuthStore } from '../services/auth.service';
import { Rol } from '../models/usuario';
export const authGuard: CanActivateFn = (_route, state) =>
  inject(AuthStore).valid() ||
  inject(Router).createUrlTree(['/ingresar'], { queryParams: { returnUrl: state.url } });
export const roleGuard: CanActivateChildFn = (route, state) => {
  const auth = inject(AuthStore),
    router = inject(Router),
    roles = route.data['roles'] as Rol[] | undefined;
  if (!auth.valid())
    return router.createUrlTree(['/ingresar'], { queryParams: { returnUrl: state.url } });
  return !roles || auth.has(roles) || router.createUrlTree(['/sin-acceso']);
};
export function safeReturnUrl(value: string | null): string {
  if (!value || value.includes('://') || value.startsWith('//') || value.includes('\\'))
    return '/app/inicio';
  const path = value.split(/[?#]/)[0];
  const allowed =
    (path.startsWith('/app/') && !path.startsWith('/app//')) ||
    /^\/empresas(?:\/[a-z0-9-]+)?$/.test(path);
  return allowed ? value : '/app/inicio';
}
