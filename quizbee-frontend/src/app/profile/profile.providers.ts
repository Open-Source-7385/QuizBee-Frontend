import { Provider, InjectionToken } from '@angular/core';
import { ProfileRepository } from './domain/repositories/profile.repository';
import { ProfileRepositoryImpl } from './infrastructure/repositories/profile-repository.impl';

/**
 * Injection token for ProfileRepository interface
 */
export const PROFILE_REPOSITORY_TOKEN = new InjectionToken<ProfileRepository>('ProfileRepository');

/**
 * Provider configuration for Profile module
 * This configures the dependency injection for the profile bounded context
 */
export const PROFILE_PROVIDERS: Provider[] = [
  // Repository Provider - binds interface to implementation
  {
    provide: PROFILE_REPOSITORY_TOKEN,
    useClass: ProfileRepositoryImpl
  },
  // Also provide the implementation directly for services that need it
  ProfileRepositoryImpl
];

/**
 * Profile feature providers for standalone components
 */
export function provideProfileFeature(): Provider[] {
  return PROFILE_PROVIDERS;
}