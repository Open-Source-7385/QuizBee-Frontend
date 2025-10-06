import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileResource, ProfileResponse, ProfilesResponse } from '../models/profile.resource';

/**
 * Assembler for converting between Profile entities and ProfileResource
 */
@Injectable({
  providedIn: 'root'
})
export class ProfileAssembler implements BaseAssembler<Profile, ProfileResource, ProfilesResponse> {

  /**
   * Converts a ProfileResource to a Profile entity
   */
  toEntityFromResource(resource: ProfileResource): Profile {
    return {
      id: resource.id,
      name: resource.name,
      email: resource.email,
      password: resource.password,
      language: resource.language,
      level: resource.level,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt)
    };
  }

  /**
   * Converts a Profile entity to a ProfileResource
   */
  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      language: entity.language,
      level: entity.level,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  /**
   * Converts an API response to an array of Profile entities
   */
  toEntitiesFromResponse(response: ProfilesResponse): Profile[] {
    return response.data.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a single profile response to a Profile entity
   */
  toEntityFromResponse(response: ProfileResponse): Profile {
    return this.toEntityFromResource(response.data);
  }

  /**
   * Converts a Profile entity to a create/update request payload
   */
  toCreateRequest(entity: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Omit<ProfileResource, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name: entity.name,
      email: entity.email,
      password: entity.password,
      language: entity.language,
      level: entity.level
    };
  }

  /**
   * Converts a Profile entity to an update request payload
   */
  toUpdateRequest(entity: Partial<Profile>): Partial<ProfileResource> {
    const resource: Partial<ProfileResource> = {};

    if (entity.name !== undefined) resource.name = entity.name;
    if (entity.email !== undefined) resource.email = entity.email;
    if (entity.password !== undefined) resource.password = entity.password;
    if (entity.language !== undefined) resource.language = entity.language;
    if (entity.level !== undefined) resource.level = entity.level;

    return resource;
  }
}