export interface CriterioEvaluacionDTO {
  id?: number;
  nombre?: string;
  puntaje?: number;
  puntajeMaximo?: number;
  comentario?: string;
}
export interface EvaluacionCrearDTO {
  postulacionId?: number;
  entrevistaId?: number;
  puntajeGeneral?: number;
  comentarios?: string;
  criterios?: CriterioEvaluacionDTO[];
}
export interface EvaluacionDTO {
  id?: number;
  postulacionId?: number;
  evaluadorId?: number;
  evaluadorNombre?: string;
  entrevistaId?: number;
  puntajeGeneral?: number;
  comentarios?: string;
  fechaEvaluacion?: string;
  criterios?: CriterioEvaluacionDTO[];
}
export interface RetroalimentacionDTO {
  id?: number;
  postulacionId?: number;
  evaluadorId?: number;
  evaluadorNombre?: string;
  contenido?: string;
  visiblePostulante?: boolean;
  fechaCreacion?: string;
}
