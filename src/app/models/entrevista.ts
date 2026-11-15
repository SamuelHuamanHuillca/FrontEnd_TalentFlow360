export type EstadoEntrevista =
  'PROGRAMADA' | 'CONFIRMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA' | 'NO_ASISTIO';
export interface EntrevistaCrearDTO {
  postulacionId?: number;
  evaluadorId?: number;
  fechaHoraInicio?: string;
  fechaHoraFin?: string;
  tipo?: string;
  ubicacionOEnlace?: string;
  notas?: string;
}
export interface EntrevistaDTO {
  id?: number;
  postulacionId?: number;
  postulanteNombre?: string;
  evaluadorId?: number;
  evaluadorNombre?: string;
  fechaHoraInicio?: string;
  fechaHoraFin?: string;
  tipo?: string;
  estado?: EstadoEntrevista;
  ubicacionOEnlace?: string;
  notas?: string;
}
