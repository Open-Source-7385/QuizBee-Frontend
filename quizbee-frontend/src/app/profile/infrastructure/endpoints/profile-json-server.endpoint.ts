import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError, catchError } from 'rxjs';
import { ProfileResource, ProfileResponse, ProfilesResponse } from '../models/profile.resource';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileAssembler } from '../assemblers/profile.assembler';
import { environment } from '../../../../environments/environment';
import { IProfileEndpoint } from './profile-endpoint.interface';

/**
 * JSON Server implementation of Profile API Endpoint
 * This implementation is specifically designed to work with json-server
 * which returns raw objects instead of wrapped API responses
 * 
 * Note: json-server is typically used for development/mocking purposes
 * @implements {IProfileEndpoint}
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileJsonServerEndpoint implements IProfileEndpoint {

  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private assembler: ProfileAssembler
  ) {}

  /**
   * Retrieves all profiles from json-server
   * @returns Observable with array of Profile entities
   */
  getAll(): Observable<Profile[]> {
    return this.http.get<ProfileResource[]>(this.baseUrl).pipe(
      map(resources => resources.map(resource => this.assembler.toEntityFromResource(resource))),
      catchError(this.handleError('Failed to fetch profiles'))
    );
  }

  /**
   * Retrieves a single profile by ID from json-server
   * @param id - The profile ID
   * @returns Observable with Profile entity
   */
  getById(id: number): Observable<Profile> {
    return this.http.get<ProfileResource>(`${this.baseUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch profile'))
    );
  }

  /**
   * Retrieves a profile by email using json-server query syntax
   * json-server supports filtering with query parameters
   * @param email - The user's email address
   * @returns Observable with ProfileResponse
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
   * Creates a new profile in json-server
   * Automatically adds timestamps
   * @param profileData - Profile data without id and timestamps
   * @returns Observable with the created Profile entity
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
   * Updates an existing profile using json-server PATCH method
   * Automatically updates the updatedAt timestamp
   * @param id - The profile ID to update
   * @param profileData - Partial profile data to update
   * @returns Observable with the updated Profile entity
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
   * Deletes a profile from json-server
   * @param id - The profile ID to delete
   * @returns Observable with boolean indicating success
   */
  delete(id: number): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(() => true),
      catchError(this.handleError('Failed to delete profile'))
    );
  }

  /**
   * Searches profiles with optional filters using json-server query syntax
   * Supports full-text search with 'q' parameter and pagination
   * @param searchTerm - Optional search term for full-text search
   * @param page - Optional page number for pagination
   * @param limit - Optional limit of results per page
   * @returns Observable with ProfilesResponse
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
   * Handles HTTP errors with detailed error messages
   * @param operation - Description of the operation that failed
   * @returns Error handler function that returns an Observable error
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