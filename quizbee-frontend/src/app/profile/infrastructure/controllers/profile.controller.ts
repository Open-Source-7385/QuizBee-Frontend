import { Injectable } from '@angular/core';
import { ProfileCommandService } from '../../application/services/profile-command.service';
import { ProfileQueryService } from '../../application/services/profile-query.service';
import { Profile } from '../../domain/entities/profile.entity';
import { CreateProfileCommand, UpdateProfileCommand, DeleteProfileCommand } from '../../application/commands/profile.commands';
import { GetProfileByIdQuery, GetProfileByEmailQuery, GetAllProfilesQuery } from '../../application/queries/profile.queries';

/**
 * Profile Controller - Application Facade
 * 
 * This controller acts as a facade that coordinates between the presentation layer
 * and the application services. It follows the Controller pattern from DDD and provides
 * a simplified interface for UI components.
 * 
 * Responsibilities:
 * - Coordinate calls to Command and Query services
 * - Transform UI requests into Command/Query objects
 * - Provide validation utilities for the UI
 * - Handle cross-cutting concerns like email availability checking
 * 
 * Note: This is NOT a REST controller - it's an Angular service that acts as
 * an application controller/facade for the frontend.
 * 
 * @see ProfileCommandService for write operations
 * @see ProfileQueryService for read operations
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileController {

  constructor(
    private profileCommandService: ProfileCommandService,
    private profileQueryService: ProfileQueryService
  ) {}

  // Query Operations

  /**
   * Get profile by ID
   */
  async getProfileById(id: number): Promise<Profile | null> {
    const query: GetProfileByIdQuery = { id };
    return await this.profileQueryService.getProfileById(query);
  }

  /**
   * Get profile by email
   */
  async getProfileByEmail(email: string): Promise<Profile | null> {
    const query: GetProfileByEmailQuery = { email };
    return await this.profileQueryService.getProfileByEmail(query);
  }

  /**
   * Get all profiles with optional search
   */
  async getAllProfiles(searchTerm?: string, page?: number, limit?: number): Promise<Profile[]> {
    const query: GetAllProfilesQuery = { searchTerm, page, limit };
    return await this.profileQueryService.getAllProfiles(query);
  }

  /**
   * Get profile statistics
   */
  async getProfileStatistics() {
    return await this.profileQueryService.getProfileStatistics();
  }

  // Command Operations

  /**
   * Create a new profile
   */
  async createProfile(profileData: {
    name: string;
    email: string;
    password: string;
    language: string;
    level: string;
  }): Promise<Profile> {
    const command: CreateProfileCommand = profileData;
    return await this.profileCommandService.createProfile(command);
  }

  /**
   * Update an existing profile
   */
  async updateProfile(
    id: number,
    updateData: {
      name?: string;
      email?: string;
      password?: string;
      language?: string;
      level?: string;
    }
  ): Promise<Profile> {
    const command: UpdateProfileCommand = { id, ...updateData };
    return await this.profileCommandService.updateProfile(command);
  }

  /**
   * Delete a profile
   */
  async deleteProfile(id: number): Promise<boolean> {
    const command: DeleteProfileCommand = { id };
    return await this.profileCommandService.deleteProfile(command);
  }

  // Utility methods for UI

  /**
   * Validate profile data (can be used by components)
   */
  validateProfileData(profileData: {
    name?: string;
    email?: string;
    password?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (profileData.name !== undefined && profileData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (profileData.email !== undefined && !this.isValidEmail(profileData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (profileData.password !== undefined && profileData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email is available
   */
  async isEmailAvailable(email: string, currentUserId?: number): Promise<boolean> {
    try {
      const existingProfile = await this.getProfileByEmail(email);
      if (!existingProfile) {
        return true; // Email is available
      }
      // If updating current user's profile, email is available if it's their own
      return currentUserId ? existingProfile.id === currentUserId : false;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}