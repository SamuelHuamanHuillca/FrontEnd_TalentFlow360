import { Component, effect, input, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
export type FormValue = Record<string, string | number | boolean | null>;
export interface OptionItem {
  value: string | number;
  label: string;
}
export interface Field {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  options?: readonly (string | OptionItem)[];
  value?: string | number | boolean;
  hint?: string;
}
export function dateOrder(start: string, end: string): ValidatorFn {
  return (group) => {
    const a = group.get(start)?.value,
      b = group.get(end)?.value;
    return a && b && b < a ? { dateOrder: true } : null;
  };
}
@Component({
  selector: 'tf-data-form',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.html',

  styleUrl: './formulario.scss',
})
export class DataForm {
  readonly fields = input.required<readonly Field[]>();
  readonly values = input<FormValue>({});
  readonly busy = input(false);
  readonly label = input('Guardar');
  readonly prefix = input('form');
  readonly submitted = output<FormValue>();
  readonly form = signal(
    new FormGroup<Record<string, FormControl<string | number | boolean | null>>>({}),
  );
  constructor() {
    effect(() => {
      const fields = this.fields(),
        values = this.values(),
        controls: Record<string, FormControl<string | number | boolean | null>> = {};
      for (const f of fields) {
        const validators: ValidatorFn[] = [];
        if (f.required) validators.push(Validators.required);
        if (f.required && f.type !== 'checkbox' && f.type !== 'number')
          validators.push(Validators.pattern(/\S/));
        if (f.type === 'email') validators.push(Validators.email);
        if (f.min !== undefined) validators.push(Validators.min(f.min));
        if (f.max !== undefined) validators.push(Validators.max(f.max));
        if (f.minLength) validators.push(Validators.minLength(f.minLength));
        if (f.maxLength) validators.push(Validators.maxLength(f.maxLength));
        if (f.type === 'url') validators.push(Validators.pattern(/^$|^https?:\/\/[^\s]+$/));
        controls[f.key] = new FormControl(
          values[f.key] ?? f.value ?? (f.type === 'checkbox' ? false : ''),
          validators,
        );
      }
      const form = new FormGroup(controls);
      const start = fields.find((x) => x.key === 'fechaInicio' || x.key === 'fechaHoraInicio');
      const end = fields.find((x) => x.key === 'fechaFin' || x.key === 'fechaHoraFin');
      if (start && end) form.addValidators(dateOrder(start.key, end.key));
      this.form.set(form);
    });
  }
  invalid(key: string): boolean {
    const c = this.form().controls[key];
    return c.invalid && c.touched;
  }
  message(f: Field): string {
    const e = this.form().controls[f.key].errors;
    return e?.['required']
      ? 'Este campo es obligatorio.'
      : e?.['email']
        ? 'Introduce un correo válido.'
        : e?.['minlength']
          ? 'Usa al menos ' + f.minLength + ' caracteres.'
          : e?.['maxlength']
            ? 'Usa como máximo ' + f.maxLength + ' caracteres.'
            : e?.['min']
              ? 'El mínimo es ' + f.min + '.'
              : e?.['max']
                ? 'El máximo es ' + f.max + '.'
                : 'Revisa el formato de este campo.';
  }
  isOption(o: string | OptionItem): o is OptionItem {
    return typeof o === 'object' && o !== null && 'value' in o;
  }
  submit(): void {
    this.form().markAllAsTouched();
    if (this.form().valid && !this.busy()) {
      const values = this.form().getRawValue();
      for (const field of this.fields()) {
        const value = values[field.key];
        const isNumericSelect =
          field.options &&
          field.options.some((opt) => this.isOption(opt) && typeof opt.value === 'number');

        if (field.type === 'number' || isNumericSelect)
          values[field.key] = value === '' || value === null ? null : Number(value);
        else if (typeof value === 'string' && field.type !== 'password')
          values[field.key] = value.trim() || null;
      }
      this.submitted.emit(values);
    }
  }
}
