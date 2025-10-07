import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from './base-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class BaseApi extends BaseApiEndpoint {
  constructor(protected http: HttpClient) {
    super();
  }

  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint, { headers: this.getHeaders() });
  }

  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(endpoint, data, { headers: this.getHeaders() });
  }

  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(endpoint, data, { headers: this.getHeaders() });
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(endpoint, { headers: this.getHeaders() });
  }
}
