import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileResource, ProfileResponse, ProfilesResponse } from '../models/profile.resource';

/**
 * Assembler for converting between Profile entities and ProfileResource DTOs
 * Implements the Assembler pattern to separate domain entities from API representations
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileAssembler implements BaseAssembler<Profile, ProfileResource, ProfilesResponse> {

  /**
   * Converts a ProfileResource (API DTO) to a Profile domain entity
   * @param resource - The resource from the API
   * @returns Profile domain entity
   */
  toEntityFromResource(resource: ProfileResource): Profile {
    return {
      id: resource.id,
      name: resource.name,
      email: resource.email,
      password: resource.password,
      avatar: resource.avatar,
      role: resource.role,
      displayName: resource.displayName,
      bio: resource.bio,
      country: resource.country,
      language: resource.language,
      languages: resource.languages,
      level: resource.level,
      stats: resource.stats,
      subscriptionStatus: resource.subscriptionStatus,
      subscriptionExpiry: resource.subscriptionExpiry ? new Date(resource.subscriptionExpiry) : undefined,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt)
    };
  }

  /**
   * Converts a Profile domain entity to a ProfileResource (API DTO)
   * @param entity - The domain entity
   * @returns ProfileResource for API communication
   */
  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      avatar: entity.avatar,
      role: entity.role,
      displayName: entity.displayName,
      bio: entity.bio,
      country: entity.country,
      language: entity.language,
      languages: entity.languages,
      level: entity.level,
      stats: entity.stats,
      subscriptionStatus: entity.subscriptionStatus,
      subscriptionExpiry: entity.subscriptionExpiry?.toISOString(),
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  /**
   * Converts an API collection response to an array of Profile entities
   * @param response - The API response containing multiple profiles
   * @returns Array of Profile domain entities
   */
  toEntitiesFromResponse(response: ProfilesResponse): Profile[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a single profile API response to a Profile entity
   * @param response - The API response containing a single profile
   * @returns Profile domain entity
   */
  toEntityFromResponse(response: ProfileResponse): Profile {
    return this.toEntityFromResource(response.data);
  }

  /**
   * Converts a Profile entity to a create request payload (without id and timestamps)
   * @param entity - The domain entity with creation data
   * @returns Create request payload
   */
  toCreateRequest(entity: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Omit<ProfileResource, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      avatar: entity.avatar,
      role: entity.role,
      displayName: entity.displayName,
      bio: entity.bio,
      country: entity.country,
      language: entity.language,
      languages: entity.languages,
      level: entity.level,
      stats: entity.stats,
      subscriptionStatus: entity.subscriptionStatus,
      subscriptionExpiry: entity.subscriptionExpiry?.toISOString()
    };
  }

  /**
   * Converts partial Profile entity data to an update request payload
   * Only includes fields that are defined in the partial entity
   * @param entity - Partial domain entity with update data
   * @returns Update request payload
   */
  toUpdateRequest(entity: Partial<Profile>): Partial<ProfileResource> {
    const resource: Partial<ProfileResource> = {};

    if (entity.name !== undefined) resource.name = entity.name;
    if (entity.email !== undefined) resource.email = entity.email;
    if (entity.password !== undefined) resource.password = entity.password;
    if (entity.avatar !== undefined) resource.avatar = entity.avatar;
    if (entity.role !== undefined) resource.role = entity.role;
    if (entity.displayName !== undefined) resource.displayName = entity.displayName;
    if (entity.bio !== undefined) resource.bio = entity.bio;
    if (entity.country !== undefined) resource.country = entity.country;
    if (entity.language !== undefined) resource.language = entity.language;
    if (entity.languages !== undefined) resource.languages = entity.languages;
    if (entity.level !== undefined) resource.level = entity.level;
    if (entity.stats !== undefined) resource.stats = entity.stats;
    if (entity.subscriptionStatus !== undefined) resource.subscriptionStatus = entity.subscriptionStatus;
    if (entity.subscriptionExpiry !== undefined) {
      resource.subscriptionExpiry = entity.subscriptionExpiry.toISOString();
    }

    return resource;
  }
}