import { TestBed } from '@angular/core/testing';
import { DataForm, dateOrder } from './formulario';
import { FormControl, FormGroup } from '@angular/forms';
describe('Validación de formularios', () => {
  it('rechaza un rango invertido', () => {
    const f = new FormGroup(
      { inicio: new FormControl('2026-11-15T10:00'), fin: new FormControl('2026-11-15T09:00') },
      dateOrder('inicio', 'fin'),
    );
    expect(f.hasError('dateOrder')).toBe(true);
  });
  it('acepta un rango válido', () => {
    const f = new FormGroup(
      { inicio: new FormControl('2026-11-15T10:00'), fin: new FormControl('2026-11-15T11:00') },
      dateOrder('inicio', 'fin'),
    );
    expect(f.valid).toBe(true);
  });
  it('no exige una fecha opcional', () => {
    const f = new FormGroup(
      { inicio: new FormControl('2026-11-15'), fin: new FormControl('') },
      dateOrder('inicio', 'fin'),
    );
    expect(f.valid).toBe(true);
  });
  it('no emite datos inválidos y muestra validaciones', async () => {
    await TestBed.configureTestingModule({ imports: [DataForm] }).compileComponents();
    const f = TestBed.createComponent(DataForm);
    f.componentRef.setInput('fields', [
      { key: 'email', label: 'Correo', type: 'email', required: true },
    ]);
    f.detectChanges();
    const spy = vi.fn();
    f.componentInstance.submitted.subscribe(spy);
    f.componentInstance.submit();
    expect(spy).not.toHaveBeenCalled();
    expect(f.componentInstance.invalid('email')).toBe(true);
  });
  it('rechaza campos obligatorios con solo espacios', async () => {
    await TestBed.configureTestingModule({ imports: [DataForm] }).compileComponents();
    const f = TestBed.createComponent(DataForm);
    f.componentRef.setInput('fields', [{ key: 'nombre', label: 'Nombre', required: true }]);
    f.detectChanges();
    f.componentInstance.form().controls['nombre'].setValue('   ');
    expect(f.componentInstance.form().invalid).toBe(true);
  });
});
