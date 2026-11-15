import { Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStore, MANAGERS, STAFF } from '../../services/auth.service';
import { Rol } from '../../models/usuario';
import { Icon } from '../icono/icono';
import { Brand } from '../marca/marca';
import { Footer } from '../footer/footer';
import { humanize } from '../estado/estado';
@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Icon, Brand, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Shell {
  readonly auth = inject(AuthStore);
  readonly router = inject(Router);
  readonly open = signal(false);
  readonly accountOpen = signal(false);
  readonly label = humanize;
  @ViewChild('accountButton') accountButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('accountPanel') accountPanel?: ElementRef<HTMLElement>;
  readonly links: { path: string; label: string; icon: string; roles?: Rol[] }[] = [
    { path: 'inicio', label: 'Mi espacio', icon: 'grid' },
    { path: 'vacantes', label: 'Oportunidades', icon: 'briefcase' },
    { path: 'perfil', label: 'Mi perfil', icon: 'user', roles: ['POSTULANTE'] },
    { path: 'postulaciones', label: 'Postulaciones', icon: 'layers' },
    { path: 'entrevistas', label: 'Agenda de entrevistas', icon: 'calendar', roles: STAFF },
    {
      path: 'evaluaciones',
      label: 'Evaluaciones',
      icon: 'check',
      roles: ['EVALUADOR', 'COORDINADOR', 'ADMINISTRADOR'],
    },
    { path: 'indicadores', label: 'Indicadores', icon: 'chart', roles: MANAGERS },
    { path: 'usuarios', label: 'Equipo y accesos', icon: 'shield', roles: MANAGERS },
  ];
  toggleAccount() {
    this.open.set(false);
    this.accountOpen.update((v) => !v);
    if (this.accountOpen())
      setTimeout(() => this.accountPanel?.nativeElement.querySelector('a')?.focus());
  }
  closeAccount(restoreFocus = false) {
    this.accountOpen.set(false);
    if (restoreFocus) this.accountButton?.nativeElement.focus();
  }
  @HostListener('document:click', ['$event']) outside(event: MouseEvent) {
    if (
      this.accountOpen() &&
      event.target instanceof Element &&
      !event.target.closest('[data-account-menu]')
    )
      this.closeAccount();
  }
  @HostListener('document:keydown.escape') escape() {
    this.open.set(false);
    if (this.accountOpen()) this.closeAccount(true);
  }
  closeNavigation() {
    this.open.set(false);
    this.closeAccount();
  }
  logout() {
    this.closeNavigation();
    this.auth.clear();
    void this.router.navigate(['/ingresar']);
  }
}
