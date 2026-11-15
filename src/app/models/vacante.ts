export type EstadoVacante = 'BORRADOR' | 'PUBLICADA' | 'EN_PROCESO' | 'CERRADA' | 'CANCELADA';
export type Modalidad = 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO';
export type TipoRequisito =
  | 'EDUCACION'
  | 'EXPERIENCIA'
  | 'HABILIDAD_TECNICA'
  | 'HABILIDAD_BLANDA'
  | 'CERTIFICACION'
  | 'IDIOMA';
export interface RequisitoVacanteDTO {
  id?: number;
  nombre?: string;
  descripcion?: string;
  tipo?: TipoRequisito;
  obligatorio?: boolean;
  pesoMatching?: number;
  valorEsperado?: string;
}
export interface VacanteCrearDTO {
  titulo?: string;
  descripcion?: string;
  empresa?: string;
  ubicacion?: string;
  modalidad?: Modalidad;
  numVacantes?: number;
  fechaCierre?: string;
  requisitos?: RequisitoVacanteDTO[];
}
export interface VacanteDTO {
  id?: number;
  titulo?: string;
  descripcion?: string;
  empresa?: string;
  ubicacion?: string;
  modalidad?: Modalidad;
  estado?: EstadoVacante;
  numVacantes?: number;
  fechaPublicacion?: string;
  fechaCierre?: string;
  fechaCreacion?: string;
  reclutadorId?: number;
  reclutadorNombre?: string;
  requisitos?: RequisitoVacanteDTO[];
}
