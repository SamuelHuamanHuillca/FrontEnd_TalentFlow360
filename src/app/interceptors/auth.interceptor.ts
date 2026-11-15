import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from '../services/auth.service';
import { ApiConfig } from '../services/api-config.service';
export function errorMessage(e: unknown): string {
  if (e instanceof HttpErrorResponse) {
    const body = e.error;
    if (body && typeof body === 'object' && typeof body.message === 'string') return body.message;
    return (
      (
        {
          0: 'No pudimos conectar. Revisa tu conexión o vuelve a intentar cuando el servidor esté disponible.',
          400: 'Revisa los datos enviados.',
          401: 'Tu sesión terminó o las credenciales son incorrectas.',
          403: 'Tu cuenta no tiene permiso para esta operación.',
          404: 'No encontramos el registro solicitado.',
          409: 'Hay un conflicto. Revisa duplicados o el horario de la entrevista.',
          422: 'Los datos no cumplen las reglas del proceso.',
        } as Record<number, string>
      )[e.status] ?? 'El servicio no pudo completar la operación. Intenta nuevamente.'
    );
  }
  return e instanceof Error && e.name === 'TimeoutError'
    ? 'El servidor tardó demasiado. Intenta nuevamente.'
    : e instanceof Error
      ? e.message
      : 'Ocurrió un problema al completar la operación.';
}
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore),
    config = inject(ApiConfig),
    router = inject(Router);
  const own = config.owns(req.url),
    isAuth = req.url.includes('/auth/');
  const request =
    own && !isAuth && auth.valid()
      ? req.clone({ setHeaders: { Authorization: 'Bearer ' + auth.session()!.token } })
      : req;
  return next(request).pipe(
    catchError((e: unknown) => {
      if (own && !isAuth && e instanceof HttpErrorResponse && e.status === 401) {
        auth.clear();
        void router.navigate(['/ingresar'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => e);
    }),
  );
};
