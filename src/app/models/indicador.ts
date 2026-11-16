export interface DashboardDTO {
  totalPostulantes?: number;
  perfilesIncompletos?: number;
  porcentajePerfilesIncompletos?: number;
  promedioCompletitud?: number;
  totalVacantes?: number;
  vacantesPublicadas?: number;
  totalPostulaciones?: number;
  postulacionesSinSeguimiento?: number;
  porcentajeSinSeguimiento?: number;
  tiempoPromedioRespuestaDias?: number;
  tiempoPromedioPrimerCambioDias?: number;
  duracionPromedioPorEtapaDias?: Record<string, number>;
  totalRechazados?: number;
  porcentajeRechazados?: number;
  totalAceptados?: number;
  porcentajeAceptados?: number;
  postulacionesSinRetroalimentacion?: number;
  porcentajeSinRetroalimentacion?: number;
  intentosConflictosBloqueados?: number;
  transicionesRechazadas?: number;
  distribucionEstadoPostulaciones?: Record<string, number>;
  cargaPorEvaluador?: Record<string, number>;
}
