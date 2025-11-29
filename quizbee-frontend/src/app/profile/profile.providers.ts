import { Provider, InjectionToken } from '@angular/core';
import { ProfileRepository } from './domain/repositories/profile.repository';
import { ProfileRepositoryImpl } from './infrastructure/repositories/profile-repository.impl';
import { PROFILE_ENDPOINT_PROVIDER } from './profile.endpoint.config';

/**
 * Injection token for ProfileRepository interface
 * This enables dependency injection based on interface rather than concrete implementation
 */
export const PROFILE_REPOSITORY_TOKEN = new InjectionToken<ProfileRepository>('ProfileRepository');

/**
 * Provider configuration for Profile bounded context
 * 
 * This configures all the dependency injection for the profile module following
 * the Dependency Inversion Principle (DIP) from SOLID.
 * 
 * Providers included:
 * - ProfileRepository: Maps interface to implementation
 * - ProfileEndpoint: Strategy pattern for API endpoint selection
 * 
 * @see profile.endpoint.config.ts for endpoint strategy configuration
 */
export const PROFILE_PROVIDERS: Provider[] = [
  // Repository Provider - binds interface to implementation
  {
    provide: PROFILE_REPOSITORY_TOKEN,
    useClass: ProfileRepositoryImpl
  },
  
  // Endpoint Provider - Strategy pattern for flexible API selection
  PROFILE_ENDPOINT_PROVIDER,
  
  // Also provide the implementation directly for services that need it
  ProfileRepositoryImpl
];

/**
 * Profile feature providers for standalone components
 * 
 * Use this function when configuring standalone components or when you need
 * to provide the Profile module dependencies in a specific scope.
 * 
 * @returns Array of providers for the Profile bounded context
 * 
 * @example
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideProfileFeature()
 *   ]
 * });
 * ```
 */
export function provideProfileFeature(): Provider[] {
  return PROFILE_PROVIDERS;
}