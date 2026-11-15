import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';
import { ApiResponse } from '../models/respuesta-api';
import { ApiConfig } from './api-config.service';
@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ApiConfig);
  get<T>(path: string, params?: Record<string, string | number>): Observable<T> {
    return this.request<T>('GET', path, undefined, params);
  }
  post<T>(path: string, body: unknown = {}): Observable<T> {
    return this.request<T>('POST', path, body);
  }
  put<T>(path: string, body: unknown): Observable<T> {
    return this.request<T>('PUT', path, body);
  }
  patch<T>(
    path: string,
    body: unknown = {},
    params?: Record<string, string | number>,
  ): Observable<T> {
    return this.request<T>('PATCH', path, body, params);
  }
  private request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number>,
  ): Observable<T> {
    return this.http
      .request<ApiResponse<T>>(method, this.config.baseUrl + path, {
        body,
        params: new HttpParams({ fromObject: params ?? {} }),
      })
      .pipe(
        timeout(90000),
        map((res) => {
          if (!res.success) throw new Error(res.message || 'La operación no pudo completarse.');
          return res.data;
        }),
      );
  }
}
