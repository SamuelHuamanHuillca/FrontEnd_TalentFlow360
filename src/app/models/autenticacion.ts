import { Rol } from './usuario';
export interface AuthResponseDTO {
  token?: string;
  email?: string;
  nombreCompleto?: string;
  usuarioId?: number;
  rol?: Rol;
  message?: string;
}
export interface LoginDTO {
  email?: string;
  password?: string;
}
