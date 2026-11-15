import { Routes } from '@angular/router';
import { MANAGERS, STAFF, RECRUITERS } from './services/auth.service';
import { authGuard, roleGuard } from './guards/auth.guard';
export const routes: Routes = [
  {
    path: 'empresas',
    loadComponent: () => import('./pages/empresas/empresas').then((m) => m.CompaniesPage),
    title: 'Empresas · TalentFlow360',
  },
  {
    path: 'empresas/:slug',
    loadComponent: () =>
      import('./pages/detalle-empresa/detalle-empresa').then((m) => m.CompanyDetail),
    title: 'Conoce la empresa · TalentFlow360',
  },
  {
    path: '',
    loadComponent: () => import('./pages/portada/portada').then((m) => m.Welcome),
    title: 'TalentFlow360 · Tu siguiente paso',
  },
  {
    path: 'ingresar',
    loadComponent: () => import('./pages/acceso/acceso').then((m) => m.AuthPage),
    title: 'Ingresar · TalentFlow360',
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/acceso/acceso').then((m) => m.AuthPage),
    data: { register: true },
    title: 'Crear cuenta · TalentFlow360',
  },
  {
    path: 'app',
    canActivate: [authGuard],
    canActivateChild: [roleGuard],
    loadComponent: () => import('./components/layout/layout').then((m) => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Home),
        title: 'Mi espacio · TalentFlow360',
      },
      {
        path: 'vacantes',
        loadComponent: () => import('./pages/vacantes/vacantes').then((m) => m.Vacancies),
        title: 'Oportunidades · TalentFlow360',
      },
      {
        path: 'vacantes/nueva',
        loadComponent: () =>
          import('./pages/crear-vacante/crear-vacante').then((m) => m.VacancyCreate),
        data: { roles: RECRUITERS },
        title: 'Crear vacante',
      },
      {
        path: 'vacantes/:id',
        loadComponent: () =>
          import('./pages/detalle-vacante/detalle-vacante').then((m) => m.VacancyDetail),
        title: 'Detalle de oportunidad',
      },
      {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil/perfil').then((m) => m.Profile),
        data: { roles: ['POSTULANTE'] },
        title: 'Mi perfil',
      },
      {
        path: 'postulaciones',
        loadComponent: () =>
          import('./pages/postulaciones/postulaciones').then((m) => m.Applications),
        title: 'Postulaciones',
      },
      {
        path: 'postulaciones/:id',
        loadComponent: () =>
          import('./pages/detalle-postulacion/detalle-postulacion').then(
            (m) => m.ApplicationDetail,
          ),
        title: 'Seguimiento y matching',
      },
      {
        path: 'entrevistas',
        loadComponent: () => import('./pages/entrevistas/entrevistas').then((m) => m.Interviews),
        data: { roles: STAFF },
        title: 'Agenda de entrevistas',
      },
      {
        path: 'evaluaciones',
        loadComponent: () => import('./pages/evaluaciones/evaluaciones').then((m) => m.Evaluations),
        data: { roles: ['EVALUADOR', 'COORDINADOR', 'ADMINISTRADOR'] },
        title: 'Evaluaciones',
      },
      {
        path: 'indicadores',
        loadComponent: () => import('./pages/indicadores/indicadores').then((m) => m.Dashboard),
        data: { roles: MANAGERS },
        title: 'Indicadores y trazabilidad',
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios').then((m) => m.Users),
        data: { roles: MANAGERS },
        title: 'Equipo y accesos',
      },
    ],
  },
  {
    path: 'sin-acceso',
    loadComponent: () => import('./pages/no-encontrado/no-encontrado').then((m) => m.ErrorPage),
    data: { forbidden: true },
    title: 'Acceso restringido',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/no-encontrado/no-encontrado').then((m) => m.ErrorPage),
    title: 'Página no encontrada',
  },
];
