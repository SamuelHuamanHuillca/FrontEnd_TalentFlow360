export type EstadoPostulacion =
  | 'PENDIENTE_REVISION'
  | 'EN_REVISION'
  | 'PRESELECCIONADO'
  | 'ENTREVISTA_PROGRAMADA'
  | 'ENTREVISTA_REALIZADA'
  | 'EVALUADO'
  | 'ACEPTADO'
  | 'RECHAZADO'
  | 'CANCELADO';
export interface CambioEstadoDTO {
  nuevoEstado?: EstadoPostulacion;
  motivo?: string;
}
export interface DetalleMatchingDTO {
  id?: number;
  requisitoVacanteId?: number;
  requisitoNombre?: string;
  requisitoTipo?: string;
  puntajeObtenido?: number;
  puntajeMaximo?: number;
  justificacion?: string;
  criterioCumplido?: boolean;
}
export interface HistorialEstadoDTO {
  id?: number;
  postulacionId?: number;
  estadoAnterior?: EstadoPostulacion;
  estadoNuevo?: EstadoPostulacion;
  motivo?: string;
  fechaCambio?: string;
  usuarioCambioId?: number;
  usuarioCambioNombre?: string;
}
export interface PostulacionDTO {
  id?: number;
  postulanteId?: number;
  postulanteNombre?: string;
  vacanteId?: number;
  vacanteTitulo?: string;
  estado?: EstadoPostulacion;
  scoreCompatibilidad?: number;
  fechaPostulacion?: string;
  fechaUltimoCambioEstado?: string;
  detallesMatching?: DetalleMatchingDTO[];
}
