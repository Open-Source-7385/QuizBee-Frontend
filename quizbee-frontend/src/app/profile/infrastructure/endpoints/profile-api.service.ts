import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Profile } from '../../domain/entities/profile.entity';
import { UserResource } from '../models/user.resource';

/**
 * Profile API Service for authentication and user management operations
 * This service handles operations specific to user authentication and profile creation
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {
  private readonly apiUrl = `${environment.platformProviderApiBaseUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Authenticates a user by email and password
   * @param email - User's email
   * @param password - User's password
   * @param rol - Optional role filter
   * @returns Observable with the authenticated user profile or null
   */
  login(email: string, password: string, rol?: 'creador' | 'aprendiz'): Observable<Profile | null> {
    let url = `${this.apiUrl}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    if (rol) {
      url += `&rol=${encodeURIComponent(rol)}`;
    }
    return this.http.get<UserResource[]>(url).pipe(
      map(resources => resources.length ? this.toEntity(resources[0]) : null),
      catchError(this.handleError('Failed to login'))
    );
  }

  /**
   * Gets a user profile by ID
   * @param id - User's unique identifier
   * @returns Observable with the user profile
   */
  getById(id: string | number): Observable<Profile> {
    return this.http.get<UserResource>(`${this.apiUrl}/${id}`).pipe(
      map(resource => this.toEntity(resource)),
      catchError(this.handleError('Failed to fetch user'))
    );
  }

  /**
   * Creates a new user profile
   * @param profile - Profile data to create
   * @returns Observable with the created profile
   */
  create(profile: Partial<Profile>): Observable<Profile> {
    const resource = this.toResource(profile);
    return this.http.post<UserResource>(this.apiUrl, resource).pipe(
      map(r => this.toEntity(r)),
      catchError(this.handleError('Failed to create user'))
    );
  }

  /**
   * Updates an existing user profile
   * @param id - User's unique identifier
   * @param profile - Partial profile data to update
   * @returns Observable with the updated profile
   */
  update(id: string | number, profile: Partial<Profile>): Observable<Profile> {
    const resource = this.toResource(profile);
    return this.http.patch<UserResource>(`${this.apiUrl}/${id}`, resource).pipe(
      map(r => this.toEntity(r)),
      catchError(this.handleError('Failed to update user'))
    );
  }

  /**
   * Converts a UserResource to a Profile entity
   * @param resource - The API resource
   * @returns Profile domain entity
   */
  private toEntity(resource: UserResource): Profile {
    return {
      id: typeof resource.id === 'string' ? parseInt(resource.id, 10) : resource.id,
      name: resource.name,
      email: resource.email,
      avatar: resource.avatar,
      password: resource.password,
      role: resource.rol,
      displayName: resource.displayName,
      bio: resource.bio,
      country: resource.country,
      language: resource.currentLanguage || 'English',
      languages: resource.languages,
      level: 'Novato', // Default level
      subscriptionStatus: resource.subscriptionStatus,
      subscriptionExpiry: resource.subscriptionExpiry ? new Date(resource.subscriptionExpiry) : undefined,
      stats: resource.stats,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Converts a Profile entity to a UserResource
   * @param profile - The domain entity
   * @returns UserResource for API communication
   */
  private toResource(profile: Partial<Profile>): Partial<UserResource> {
    return {
      id: profile.id?.toString(),
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      password: profile.password,
      rol: profile.role,
      displayName: profile.displayName,
      bio: profile.bio,
      country: profile.country,
      languages: profile.languages,
      currentLanguage: profile.language,
      subscriptionStatus: profile.subscriptionStatus,
      subscriptionExpiry: profile.subscriptionExpiry?.toISOString(),
      stats: profile.stats
    };
  }

  /**
   * Handles HTTP errors
   * @param operation - Description of the operation that failed
   * @returns Error handler function
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation}:`, error);
      const errorMessage = error.error?.message || error.message || error.statusText || 'Unknown error';
      return throwError(() => new Error(`${operation}: ${errorMessage}`));
    };
  }
}
