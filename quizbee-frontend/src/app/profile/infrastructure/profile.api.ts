import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { UserResource } from './user.resource';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {
  private readonly apiUrl = `${environment.platformProviderApiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Busca usuario por email y password (simula login en json-server)
   */
  login(email: string, password: string, rol?: 'creador' | 'aprendiz'): Observable<User | null> {
    let url = `${this.apiUrl}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    if (rol) {
      url += `&rol=${encodeURIComponent(rol)}`;
    }
    return this.http.get<UserResource[]>(url).pipe(
      map(resources => resources.length ? this.toEntity(resources[0]) : null),
      catchError(this.handleError('Failed to login'))
    );
  }

  getById(id: string) {
    return this.http.get<UserResource>(`${this.apiUrl}/${id}`).pipe(
      map(resource => this.toEntity(resource)),
      catchError(this.handleError('Failed to fetch user'))
    );
  }

  create(user: User) {
    const resource = this.toResource(user);
    return this.http.post<UserResource>(this.apiUrl, resource).pipe(
      map(r => this.toEntity(r)),
      catchError(this.handleError('Failed to create user'))
    );
  }

  private toEntity(resource: UserResource): User {
    return new User({
      id: resource.id,
      name: resource.name,
      email: resource.email,
      avatar: resource.avatar,
      password: resource.password,
      rol: resource.rol
    });
  }

  private toResource(user: User): UserResource {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      password: user.password,
      rol: user.rol
    };
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`${operation}:`, error);
      return throwError(() => new Error(`${operation}: ${error.message || error.statusText}`));
    };
  }
}
