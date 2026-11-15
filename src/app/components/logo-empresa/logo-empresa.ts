import { Component, input, signal } from '@angular/core';
import { Company } from '../../models/empresa';
@Component({
  selector: 'tf-company-logo',
  templateUrl: './logo-empresa.html',
  styleUrl: './logo-empresa.scss',
})
export class CompanyLogo {
  readonly company = input.required<Company>();
  readonly eager = input(false);
  readonly failed = signal(false);
}
