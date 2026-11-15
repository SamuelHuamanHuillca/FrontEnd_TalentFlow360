import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Icon } from '../icono/icono';
export interface OpportunityQuery {
  query: string;
  location: string;
}
@Component({
  selector: 'tf-opportunity-search',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './buscador-oportunidades.html',
  styleUrl: './buscador-oportunidades.scss',
})
export class OpportunitySearch {
  readonly vertical = input(false);
  readonly searched = output<OpportunityQuery>();
  readonly form = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
    location: new FormControl('', { nonNullable: true }),
  });
  search() {
    const value = this.form.getRawValue();
    this.searched.emit({ query: value.query.trim(), location: value.location });
  }
}
