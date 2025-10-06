import { Injectable, Inject } from '@angular/core';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { Profile } from '../../domain/entities/profile.entity';
import { CreateProfileCommand, UpdateProfileCommand, DeleteProfileCommand } from '../commands/profile.commands';
import { RoleManager } from '../../domain/services/role-manager.service';
import { PROFILE_REPOSITORY_TOKEN } from '../../profile.providers';

/**
 * Profile Command Service - handles business logic for profile commands
 * Based on the ProfileCommandService from the DDD diagram
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileCommandService {

  constructor(@Inject(PROFILE_REPOSITORY_TOKEN) private profileRepository: ProfileRepository) {}

  /**
   * Creates a new profile
   */
  async createProfile(command: CreateProfileCommand): Promise<Profile> {
    // Business logic validation
    this.validateProfileData(command);

    // Check if email already exists
    const existingProfile = await this.profileRepository.getByEmail(command.email);
    if (existingProfile) {
      throw new Error('Email already exists');
    }

    // Create the profile
    const profileData = {
      ...command,
      // Add any additional business logic here
    };

    return await this.profileRepository.create(profileData);
  }

  /**
   * Updates an existing profile
   */
  async updateProfile(command: UpdateProfileCommand): Promise<Profile> {
    // Validate that profile exists
    const existingProfile = await this.profileRepository.getById(command.id);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // If email is being updated, check it doesn't exist
    if (command.email && command.email !== existingProfile.email) {
      const emailExists = await this.profileRepository.getByEmail(command.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    // Apply business rules
    const updateData = this.applyUpdateRules(command, existingProfile);

    return await this.profileRepository.update(command.id, updateData);
  }

  /**
   * Deletes a profile
   */
  async deleteProfile(command: DeleteProfileCommand): Promise<boolean> {
    // Validate that profile exists
    const existingProfile = await this.profileRepository.getById(command.id);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Apply any business rules for deletion
    // For example, check if user has permission to delete
    
    return await this.profileRepository.delete(command.id);
  }

  /**
   * Validates profile data according to business rules
   */
  private validateProfileData(profileData: CreateProfileCommand): void {
    if (!profileData.name || profileData.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!profileData.email || !this.isValidEmail(profileData.email)) {
      throw new Error('Valid email is required');
    }

    if (!profileData.password || profileData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  /**
   * Applies business rules for profile updates
   */
  private applyUpdateRules(command: UpdateProfileCommand, existingProfile: Profile): Partial<Profile> {
    const updateData: Partial<Profile> = {};

    if (command.name !== undefined) {
      if (command.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      updateData.name = command.name.trim();
    }

    if (command.email !== undefined) {
      if (!this.isValidEmail(command.email)) {
        throw new Error('Valid email is required');
      }
      updateData.email = command.email;
    }

    if (command.password !== undefined) {
      if (command.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      updateData.password = command.password;
    }

    if (command.language !== undefined) {
      updateData.language = command.language;
    }

    if (command.level !== undefined) {
      updateData.level = command.level;
    }

    return updateData;
  }

  /**
   * Simple email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}