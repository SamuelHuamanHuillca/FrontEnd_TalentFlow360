import { TipoRequisito } from './vacante';
export type NivelEducacion =
  | 'SECUNDARIA'
  | 'TECNICO'
  | 'UNIVERSITARIO_EN_CURSO'
  | 'BACHILLER'
  | 'TITULADO'
  | 'MAESTRIA'
  | 'DOCTORADO';
export interface EducacionDTO {
  id?: number;
  institucion?: string;
  titulo?: string;
  campoEstudio?: string;
  nivelEducacion?: NivelEducacion;
  fechaInicio?: string;
  fechaFin?: string;
  enCurso?: boolean;
}
export interface ExperienciaDTO {
  id?: number;
  empresa?: string;
  cargo?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  actual?: boolean;
}
export interface HabilidadDTO {
  id?: number;
  nombre?: string;
  tipo?: TipoRequisito;
  nivelDominio?: string;
  aniosExperiencia?: number;
}
export interface PostulanteCrearDTO {
  resumenProfesional?: string;
  telefono?: string;
  direccion?: string;
  linkedinUrl?: string;
}
export interface PostulanteDTO {
  id?: number;
  usuarioId?: number;
  nombreCompleto?: string;
  email?: string;
  resumenProfesional?: string;
  telefono?: string;
  direccion?: string;
  linkedinUrl?: string;
  perfilCompleto?: boolean;
  porcentajeCompletitud?: number;
  fechaActualizacion?: string;
  educaciones?: EducacionDTO[];
  experiencias?: ExperienciaDTO[];
  habilidades?: HabilidadDTO[];
}
