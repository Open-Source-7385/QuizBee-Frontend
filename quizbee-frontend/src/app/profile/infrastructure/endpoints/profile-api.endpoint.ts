import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProfileResource, ProfileResponse, ProfilesResponse } from '../models/profile.resource';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileAssembler } from '../assemblers/profile.assembler';
import { environment } from '../../../../environments/environment';
import { IProfileEndpoint } from './profile-endpoint.interface';

/**
 * REST API implementation of Profile API Endpoint
 * This implementation is designed for a production REST API that returns wrapped responses
 * with standard response formats (success, message, data)
 * 
 * Use this implementation when connecting to a real backend API
 * @implements {IProfileEndpoint}
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileApiEndpoint implements IProfileEndpoint {

  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private assembler: ProfileAssembler
  ) {}

  /**
   * Retrieves all profiles from the REST API
   * @returns Observable with array of Profile entities
   */
  getAll(): Observable<Profile[]> {
    return this.http.get<ProfilesResponse>(this.endpointUrl).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response))
    );
  }

  /**
   * Retrieves a single profile by ID from the REST API
   * @param id - The profile ID
   * @returns Observable with Profile entity
   */
  getById(id: number): Observable<Profile> {
    return this.http.get<ProfileResponse>(`${this.endpointUrl}/${id}`).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  /**
   * Retrieves a profile by email from the REST API
   * @param email - The user's email address
   * @returns Observable with ProfileResponse
   */
  getByEmail(email: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.endpointUrl}/email/${email}`);
  }

  /**
   * Creates a new profile via REST API
   * @param profileData - Profile data without id and timestamps
   * @returns Observable with the created Profile entity
   */
  create(profileData: Omit<ProfileResource, 'id' | 'createdAt' | 'updatedAt'>): Observable<Profile> {
    return this.http.post<ProfileResponse>(this.endpointUrl, profileData).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  /**
   * Updates an existing profile via REST API
   * @param id - The profile ID to update
   * @param profileData - Partial profile data to update
   * @returns Observable with the updated Profile entity
   */
  update(id: number, profileData: Partial<ProfileResource>): Observable<Profile> {
    return this.http.put<ProfileResponse>(`${this.endpointUrl}/${id}`, profileData).pipe(
      map(response => this.assembler.toEntityFromResponse(response))
    );
  }

  /**
   * Deletes a profile via REST API
   * @param id - The profile ID to delete
   * @returns Observable with boolean indicating success
   */
  delete(id: number): Observable<boolean> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.endpointUrl}/${id}`).pipe(
      map(response => response.success)
    );
  }

  /**
   * Searches profiles with optional filters via REST API
   * @param searchTerm - Optional search term
   * @param page - Optional page number for pagination
   * @param limit - Optional limit of results per page
   * @returns Observable with ProfilesResponse
   */
  getAllWithSearch(searchTerm?: string, page?: number, limit?: number): Observable<ProfilesResponse> {
    let queryParams = '';
    const params: string[] = [];

    if (searchTerm) {
      params.push(`search=${encodeURIComponent(searchTerm)}`);
    }
    if (page) {
      params.push(`page=${page}`);
    }
    if (limit) {
      params.push(`limit=${limit}`);
    }

    if (params.length > 0) {
      queryParams = '?' + params.join('&');
    }

    return this.http.get<ProfilesResponse>(`${this.endpointUrl}${queryParams}`);
  }
}