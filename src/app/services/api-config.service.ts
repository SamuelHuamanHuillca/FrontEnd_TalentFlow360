import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class ApiConfig {
  private readonly http = inject(HttpClient);
  baseUrl = '/api';
  async load(): Promise<void> {
    const config = await firstValueFrom(this.http.get<{ apiBaseUrl: string }>('/config.json'));
    const base = config.apiBaseUrl.replace(/\/$/, '');
    if (!(
      base.startsWith('https://') ||
      base === '/api' ||
      /^http:\/\/localhost(:\d+)?\/api$/.test(base)
    ))
      throw new Error('Configuración de API inválida');
    this.baseUrl = base;
  }
  owns(url: string): boolean {
    return url.startsWith(this.baseUrl + '/');
  }
}
