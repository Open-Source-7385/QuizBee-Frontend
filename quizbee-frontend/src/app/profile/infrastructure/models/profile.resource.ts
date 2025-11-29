import { BaseResource } from '../../../shared/infrastructure/base-response';

/**
 * Profile resource representation for API communication
 * This is the complete profile data structure for REST API operations
 */
export interface ProfileResource extends BaseResource {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional for security
  avatar?: string;
  role?: 'creador' | 'aprendiz' | 'admin' | 'moderator';
  displayName?: string;
  bio?: string;
  country?: string;
  language: string;
  languages?: string[];
  level: string;
  stats?: {
    lives: number;
    points: number;
    quizzesPlayed: number;
    quizzesWon: number;
    quizzesLost: number;
    currentStreak: number;
  };
  subscriptionStatus?: 'active' | 'free' | 'cancelled';
  subscriptionExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Single profile API response wrapper
 */
export interface ProfileResponse {
  data: ProfileResource;
  message: string;
  success: boolean;
}

/**
 * Multiple profiles collection API response wrapper
 */
export interface ProfilesResponse {
  data: ProfileResource[];
  message: string;
  success: boolean;
  total: number;
  page?: number;
  limit?: number;
}