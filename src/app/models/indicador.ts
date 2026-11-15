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
  postulacionesSinRetroalimentacion?: number;
  porcentajeSinRetroalimentacion?: number;
  distribucionEstadoPostulaciones?: Record<string, number>;
  cargaPorEvaluador?: Record<string, number>;
}
