import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { ProfileResource, ProfileResponse, ProfilesResponse } from '../models/profile.resource';
import { ProfileAssembler } from '../assemblers/profile.assembler';
import { Profile } from '../../domain/entities/profile.entity';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * API endpoint for Profile operations
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileApiEndpoint extends BaseApiEndpoint<Profile, ProfileResource, ProfilesResponse, ProfileAssembler> {

  constructor(
    http: HttpClient,
    assembler: ProfileAssembler
  ) {
    super(http, `${environment.platformProviderApiBaseUrl}/profiles`, assembler);
  }

  /**
   * Get profile by email
   */
  getByEmail(email: string): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.endpointUrl}/email/${email}`);
  }

  /**
   * Get all profiles with optional search
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

  /**
   * Create a new profile
   */
  createProfile(profileData: Omit<ProfileResource, 'id' | 'createdAt' | 'updatedAt'>): Observable<ProfileResponse> {
    return this.http.post<ProfileResponse>(this.endpointUrl, profileData);
  }

  /**
   * Update an existing profile
   */
  updateProfile(id: number, profileData: Partial<ProfileResource>): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(`${this.endpointUrl}/${id}`, profileData);
  }

  /**
   * Delete a profile
   */
  deleteProfile(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.endpointUrl}/${id}`);
  }
}