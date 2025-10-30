import { Injectable, Inject } from '@angular/core';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { Profile } from '../../domain/entities/profile.entity';
import { GetProfileByIdQuery, GetProfileByEmailQuery, GetAllProfilesQuery } from '../queries/profile.queries';
import { PROFILE_REPOSITORY_TOKEN } from '../../profile.providers';

/**
 * Profile Query Service - handles business logic for profile queries
 * Based on the ProfileQueryService from the DDD diagram
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileQueryService {

  constructor(@Inject(PROFILE_REPOSITORY_TOKEN) private profileRepository: ProfileRepository) {}

  /**
   * Gets a profile by ID
   */
  async getProfileById(query: GetProfileByIdQuery): Promise<Profile | null> {
    if (!query.id || query.id <= 0) {
      throw new Error('Valid profile ID is required');
    }

    return await this.profileRepository.getById(query.id);
  }

  /**
   * Gets a profile by email
   */
  async getProfileByEmail(query: GetProfileByEmailQuery): Promise<Profile | null> {
    if (!query.email || !this.isValidEmail(query.email)) {
      throw new Error('Valid email is required');
    }

    return await this.profileRepository.getByEmail(query.email);
  }

  /**
   * Gets all profiles with optional filtering
   */
  async getAllProfiles(query: GetAllProfilesQuery = {}): Promise<Profile[]> {
    // Get all profiles from repository
    const profiles = await this.profileRepository.getAll();

    // Apply any filtering logic
    let filteredProfiles = profiles;

    if (query.searchTerm) {
      const searchTerm = query.searchTerm.toLowerCase();
      filteredProfiles = profiles.filter(profile => 
        profile.name.toLowerCase().includes(searchTerm) ||
        profile.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination if specified
    if (query.page && query.limit) {
      const startIndex = (query.page - 1) * query.limit;
      const endIndex = startIndex + query.limit;
      filteredProfiles = filteredProfiles.slice(startIndex, endIndex);
    }

    return filteredProfiles;
  }

  /**
   * Gets profile statistics (could be useful for admin dashboard)
   */
  async getProfileStatistics(): Promise<{
    totalProfiles: number;
    profilesByLanguage: Record<string, number>;
    profilesByLevel: Record<string, number>;
  }> {
    const profiles = await this.profileRepository.getAll();

    const stats = {
      totalProfiles: profiles.length,
      profilesByLanguage: {} as Record<string, number>,
      profilesByLevel: {} as Record<string, number>
    };

    // Count by language
    profiles.forEach(profile => {
      stats.profilesByLanguage[profile.language] = 
        (stats.profilesByLanguage[profile.language] || 0) + 1;
    });

    // Count by level
    profiles.forEach(profile => {
      stats.profilesByLevel[profile.level] = 
        (stats.profilesByLevel[profile.level] || 0) + 1;
    });

    return stats;
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}