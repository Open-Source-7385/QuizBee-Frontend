import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, throwError, catchError } from 'rxjs';
import { ProfileResource, ProfileResponse, ProfilesResponse } from '../models/profile.resource';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileAssembler } from '../assemblers/profile.assembler';
import { environment } from '../../../../environments/environment';

/**
 * JSON Server implementation of ProfileApiEndpoint
 * This works specifically with json-server which returns raw objects instead of wrapped responses
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileJsonServerEndpoint {

  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/profiles`;

  constructor(
    private http: HttpClient,
    private assembler: ProfileAssembler
  ) {}

  /**
   * Get all profiles
   */
  getAll(): Observable<Profile[]> {
    return this.http.get<ProfileResource[]>(this.baseUrl).pipe(
      map(resources => resources.map(resource => this.assembler.toEntityFromResource(resource))),
      catchError(this.handleError('Failed to fetch profiles'))
    );
  }

  /**
   * Get profile by ID
   */
  getById(id: number): Observable<Profile> {
    return this.http.get<ProfileResource>(`${this.baseUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch profile'))
    );
  }

  /**
   * Get profile by email
   */
  getByEmail(email: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResource[]>(`${this.baseUrl}?email=${email}`).pipe(
      map(resources => {
        if (resources.length === 0) {
          throw new Error('Profile not found');
        }
        const resource = resources[0];
        return {
          data: resource,
          message: 'Profile found successfully',
          success: true
        };
      }),
      catchError(this.handleError('Failed to fetch profile by email'))
    );
  }

  /**
   * Create a new profile
   */
  create(profileData: Omit<ProfileResource, 'id' | 'createdAt' | 'updatedAt'>): Observable<Profile> {
    const now = new Date().toISOString();
    const dataWithTimestamps = {
      ...profileData,
      createdAt: now,
      updatedAt: now
    };

    return this.http.post<ProfileResource>(this.baseUrl, dataWithTimestamps).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to create profile'))
    );
  }

  /**
   * Update an existing profile
   */
  update(id: number, profileData: Partial<ProfileResource>): Observable<Profile> {
    const dataWithTimestamp = {
      ...profileData,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<ProfileResource>(`${this.baseUrl}/${id}`, dataWithTimestamp).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to update profile'))
    );
  }

  /**
   * Delete a profile
   */
  delete(id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => true),
      catchError(this.handleError('Failed to delete profile'))
    );
  }

  /**
   * Get profiles with search functionality
   */
  getAllWithSearch(searchTerm?: string, page?: number, limit?: number): Observable<ProfilesResponse> {
    let url = this.baseUrl;
    const params: string[] = [];

    if (searchTerm) {
      // json-server supports q parameter for full-text search
      params.push(`q=${encodeURIComponent(searchTerm)}`);
    }
    if (page && limit) {
      params.push(`_page=${page}`);
      params.push(`_limit=${limit}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.http.get<ProfileResource[]>(url).pipe(
      map(resources => ({
        data: resources,
        message: 'Profiles retrieved successfully',
        success: true,
        total: resources.length,
        page,
        limit
      })),
      catchError(this.handleError('Failed to search profiles'))
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`${operation}:`, error);
      let errorMessage = operation;
      
      if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.status === 0) {
        errorMessage = `${operation}: Unable to connect to server`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.statusText || 'Unknown Error'}`;
      }
      
      return throwError(() => new Error(errorMessage));
    };
  }
}