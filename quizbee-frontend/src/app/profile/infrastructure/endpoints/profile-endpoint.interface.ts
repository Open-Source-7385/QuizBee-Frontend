import { Observable } from 'rxjs';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileResource, ProfileResponse, ProfilesResponse } from '../models/profile.resource';

/**
 * Abstract interface for Profile API endpoints
 * This interface defines the contract for different API implementations (REST, JSON Server, etc.)
 * Implements the Strategy pattern to allow switching between different backend implementations
 */
export interface IProfileEndpoint {
  /**
   * Retrieves all profiles
   * @returns Observable with array of profiles
   */
  getAll(): Observable<Profile[]>;

  /**
   * Retrieves a profile by its unique identifier
   * @param id - The profile ID
   * @returns Observable with the profile
   */
  getById(id: number): Observable<Profile>;

  /**
   * Retrieves a profile by email address
   * @param email - The user's email
   * @returns Observable with the profile response
   */
  getByEmail(email: string): Observable<ProfileResponse>;

  /**
   * Creates a new profile
   * @param profileData - The profile data without id and timestamps
   * @returns Observable with the created profile
   */
  create(profileData: Omit<ProfileResource, 'id' | 'createdAt' | 'updatedAt'>): Observable<Profile>;

  /**
   * Updates an existing profile
   * @param id - The profile ID to update
   * @param profileData - Partial profile data to update
   * @returns Observable with the updated profile
   */
  update(id: number, profileData: Partial<ProfileResource>): Observable<Profile>;

  /**
   * Deletes a profile
   * @param id - The profile ID to delete
   * @returns Observable with boolean indicating success
   */
  delete(id: number): Observable<boolean>;

  /**
   * Searches profiles with optional filters
   * @param searchTerm - Optional search term
   * @param page - Optional page number for pagination
   * @param limit - Optional limit of results per page
   * @returns Observable with the search results
   */
  getAllWithSearch(searchTerm?: string, page?: number, limit?: number): Observable<ProfilesResponse>;
}
