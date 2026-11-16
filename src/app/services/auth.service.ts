import { Injectable, computed, signal } from '@angular/core';
import { AuthResponseDTO } from '../models/autenticacion';
import { Rol } from '../models/usuario';
export const ROLES: Rol[] = [
  'POSTULANTE',
  'RECLUTADOR',
  'EVALUADOR',
  'COORDINADOR',
  'ADMINISTRADOR',
];
export const STAFF: Rol[] = ['RECLUTADOR', 'EVALUADOR', 'COORDINADOR', 'ADMINISTRADOR'];
export const MANAGERS: Rol[] = ['COORDINADOR', 'ADMINISTRADOR'];
export const RECRUITERS: Rol[] = ['RECLUTADOR', ...MANAGERS];
export const REVIEWERS: Rol[] = ['EVALUADOR', 'COORDINADOR'];
export function jwtExpiry(token: string): number {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(part));
    return Number(payload.exp) * 1000 || 0;
  } catch {
    return 0;
  }
}
function loadStoredSession(): AuthResponseDTO | null {
  try {
    const raw = sessionStorage.getItem('tf360_session');
    if (!raw) return null;
    const s = JSON.parse(raw) as AuthResponseDTO;
    if (s?.token && jwtExpiry(s.token) > Date.now()) return s;
    sessionStorage.removeItem('tf360_session');
    return null;
  } catch {
    return null;
  }
}
@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly session = signal<AuthResponseDTO | null>(loadStoredSession());
  readonly authenticated = computed(
    () => !!this.session()?.token && jwtExpiry(this.session()!.token!) > Date.now(),
  );
  readonly name = computed(() => this.session()?.nombreCompleto ?? '');
  readonly role = computed(() => this.session()?.rol);
  has(roles: readonly Rol[]): boolean {
    return this.valid() && roles.includes(this.role()!);
  }
  valid(): boolean {
    const s = this.session();
    return !!s?.token && ROLES.includes(s.rol!) && jwtExpiry(s.token) > Date.now();
  }
  set(session: AuthResponseDTO): void {
    if (
      !session.token ||
      !session.usuarioId ||
      !ROLES.includes(session.rol!) ||
      jwtExpiry(session.token) <= Date.now()
    )
      throw new Error('La API devolvió una sesión inválida.');
    this.session.set(session);
    try {
      sessionStorage.setItem('tf360_session', JSON.stringify(session));
    } catch {}
  }
  clear(): void {
    this.session.set(null);
    try {
      sessionStorage.removeItem('tf360_session');
    } catch {}
  }
}
