import { BaseResource } from '../../../shared/infrastructure/base-response';

/**
 * Profile resource representation for API communication
 */
export interface ProfileResource extends BaseResource {
  id: number;
  name: string;
  email: string;
  password: string;
  language: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Profile API response
 */
export interface ProfileResponse {
  data: ProfileResource;
  message: string;
  success: boolean;
}

/**
 * Profiles collection API response
 */
export interface ProfilesResponse {
  data: ProfileResource[];
  message: string;
  success: boolean;
  total: number;
  page?: number;
  limit?: number;
}