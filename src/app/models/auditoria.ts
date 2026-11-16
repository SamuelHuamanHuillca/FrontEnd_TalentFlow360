export interface AuditoriaEventoDTO {
  id?: number;
  tipoEvento?: string;
  accion?: string;
  detalle?: string;
  usuarioResponsable?: string;
  usuarioRol?: string;
  recursoAfectado?: string;
  exitoso?: boolean;
  fechaHora?: string;
}
