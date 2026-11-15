export type Rol = 'POSTULANTE' | 'RECLUTADOR' | 'EVALUADOR' | 'COORDINADOR' | 'ADMINISTRADOR';
export interface UsuarioDTO {
  id?: number;
  email?: string;
  nombre?: string;
  apellido?: string;
  rol?: Rol;
  activo?: boolean;
  fechaCreacion?: string;
}
export interface UsuarioRegistroDTO {
  email?: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  rol?: Rol;
}
