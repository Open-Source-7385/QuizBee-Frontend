import { Provider, InjectionToken } from '@angular/core';
import { IProfileEndpoint } from './infrastructure/endpoints/profile-endpoint.interface';
import { ProfileJsonServerEndpoint } from './infrastructure/endpoints/profile-json-server.endpoint';
import { ProfileApiEndpoint } from './infrastructure/endpoints/profile-api.endpoint';
import { environment } from '../../environments/environment';

/**
 * Injection token for the Profile Endpoint strategy
 * This allows switching between different endpoint implementations
 */
export const PROFILE_ENDPOINT_TOKEN = new InjectionToken<IProfileEndpoint>('ProfileEndpoint');

/**
 * Profile endpoint strategy configuration
 * 
 * This provider uses the Strategy pattern to determine which endpoint implementation
 * to use based on the environment or configuration.
 * 
 * Strategy:
 * - Development/Mock: ProfileJsonServerEndpoint (uses json-server)
 * - Production: ProfileApiEndpoint (uses real REST API)
 * 
 * To change the strategy, modify the useClass based on your needs or environment
 */
export const PROFILE_ENDPOINT_PROVIDER: Provider = {
  provide: PROFILE_ENDPOINT_TOKEN,
  useClass: ProfileJsonServerEndpoint // Change to ProfileApiEndpoint for production
};

/**
 * Alternative: Environment-based strategy selection
 * Uncomment this to automatically switch based on environment
 */
/*
export const PROFILE_ENDPOINT_PROVIDER: Provider = {
  provide: PROFILE_ENDPOINT_TOKEN,
  useClass: environment.production ? ProfileApiEndpoint : ProfileJsonServerEndpoint
};
*/

/**
 * Helper function to get endpoint providers
 * Use this when you need to provide the endpoint in a specific context
 */
export function provideProfileEndpoint(useProduction: boolean = false): Provider {
  return {
    provide: PROFILE_ENDPOINT_TOKEN,
    useClass: useProduction ? ProfileApiEndpoint : ProfileJsonServerEndpoint
  };
}
