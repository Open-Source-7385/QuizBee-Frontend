import { Injectable } from '@angular/core';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileJsonServerEndpoint } from '../endpoints/profile-json-server.endpoint';
import { ProfileAssembler } from '../assemblers/profile.assembler';
import { firstValueFrom } from 'rxjs';

/**
 * Implementation of ProfileRepository using JSON Server
 * This is the concrete implementation of the repository interface
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileRepositoryImpl implements ProfileRepository {

  constructor(
    private profileApi: ProfileJsonServerEndpoint,
    private assembler: ProfileAssembler
  ) {}

  /**
   * Gets a profile by ID
   */
  async getById(id: number): Promise<Profile | null> {
    try {
      const profile = await firstValueFrom(this.profileApi.getById(id));
      return profile;
    } catch (error) {
      // If profile not found, return null instead of throwing
      if ((error as any)?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Gets a profile by email
   */
  async getByEmail(email: string): Promise<Profile | null> {
    try {
      const response = await firstValueFrom(this.profileApi.getByEmail(email));
      return this.assembler.toEntityFromResponse(response);
    } catch (error) {
      // If profile not found, return null instead of throwing
      if ((error as any)?.message?.includes('not found')) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Creates a new profile
   */
  async create(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    const profileData = this.assembler.toCreateRequest(profile);
    return await firstValueFrom(this.profileApi.create(profileData));
  }

  /**
   * Updates an existing profile
   */
  async update(id: number, profile: Partial<Profile>): Promise<Profile> {
    const updateData = this.assembler.toUpdateRequest(profile);
    return await firstValueFrom(this.profileApi.update(id, updateData));
  }

  /**
   * Deletes a profile
   */
  async delete(id: number): Promise<boolean> {
    try {
      return await firstValueFrom(this.profileApi.delete(id));
    } catch (error) {
      console.error('Error deleting profile:', error);
      return false;
    }
  }

  /**
   * Gets all profiles
   */
  async getAll(): Promise<Profile[]> {
    try {
      return await firstValueFrom(this.profileApi.getAll());
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  }

  /**
   * Gets profiles with search functionality
   */
  async getAllWithSearch(searchTerm?: string, page?: number, limit?: number): Promise<Profile[]> {
    try {
      const response = await firstValueFrom(this.profileApi.getAllWithSearch(searchTerm, page, limit));
      return this.assembler.toEntitiesFromResponse(response);
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  }
}