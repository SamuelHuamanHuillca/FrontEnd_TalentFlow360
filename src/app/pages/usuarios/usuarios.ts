import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthStore, ROLES } from '../../services/auth.service';
import { TalentApi } from '../../services/talent-api.service';
import { UsuarioDTO } from '../../models/usuario';
import { NoticeStore } from '../../services/avisos.service';
import { errorMessage } from '../../interceptors/auth.interceptor';
import { AsyncState } from '../../components/estado-carga/estado-carga';
import { DataForm, Field, FormValue } from '../../components/formulario/formulario';
@Component({
  imports: [FormsModule, AsyncState, DataForm],
  templateUrl: './usuarios.html',

  styleUrl: './usuarios.scss',
})
export class Users {
  readonly auth = inject(AuthStore);
  private readonly api = inject(TalentApi);
  private readonly notice = inject(NoticeStore);
  readonly roles = ROLES;
  readonly rows = signal<UsuarioDTO[]>([]);
  readonly loading = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly actionError = signal('');
  readonly query = signal('');
  readonly role = signal('');
  readonly page = signal(1);
  readonly editing = signal<UsuarioDTO | null>(null);
  readonly confirm = signal<UsuarioDTO | null>(null);
  readonly showForm = signal(false);
  readonly values = signal<FormValue>({});
  readonly fields = computed<Field[]>(() => [
    { key: 'nombre', label: 'Nombre', required: true, maxLength: 80 },
    { key: 'apellido', label: 'Apellido', required: true, maxLength: 80 },
    { key: 'email', label: 'Correo', type: 'email', required: true, maxLength: 100 },
    ...(!this.editing()
      ? [
          {
            key: 'password',
            label: 'Contraseña inicial',
            type: 'password',
            required: true,
            minLength: 8,
            maxLength: 72,
          },
        ]
      : []),
    { key: 'rol', label: 'Rol', required: true, options: ROLES },
  ]);
  readonly filtered = computed(() =>
    this.rows().filter(
      (u) =>
        (!this.role() || u.rol === this.role()) &&
        [u.nombre, u.apellido, u.email]
          .join(' ')
          .toLowerCase()
          .includes(this.query().toLowerCase()),
    ),
  );
  readonly visible = computed(() =>
    this.filtered().slice((this.page() - 1) * 15, this.page() * 15),
  );
  constructor() {
    this.load();
  }
  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.client
      .get<UsuarioDTO[]>('/usuarios')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (u) => this.rows.set(u), error: (e) => this.error.set(errorMessage(e)) });
  }
  create() {
    this.editing.set(null);
    this.values.set({});
    this.showForm.set(true);
  }
  edit(u: UsuarioDTO) {
    this.editing.set(u);
    this.values.set({
      nombre: u.nombre ?? '',
      apellido: u.apellido ?? '',
      email: u.email ?? '',
      rol: u.rol ?? '',
    });
    this.showForm.set(true);
  }
  save(v: FormValue) {
    if (this.editing()) {
      this.actionError.set(
        'La API actual exige una contraseña al editar, aunque no la actualiza. Esta operación requiere corregir el DTO de actualización del backend.',
      );
      return;
    }
    this.busy.set(true);
    this.actionError.set('');
    this.api.client
      .post('/usuarios', v)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.showForm.set(false);
          this.notice.show('Cuenta guardada.');
          this.load();
        },
        error: (e) => this.actionError.set(errorMessage(e)),
      });
  }
  deactivate(id: number) {
    this.busy.set(true);
    this.actionError.set('');
    this.api.client
      .patch('/usuarios/' + id + '/desactivar')
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.confirm.set(null);
          this.notice.show('Cuenta desactivada.');
          this.load();
        },
        error: (e) => this.actionError.set(errorMessage(e)),
      });
  }
}
