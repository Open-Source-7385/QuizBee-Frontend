import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for ranking lists
 */
export interface RankingResponse extends BaseResponse {
  rankings: RankingResource[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Represents a single ranking resource returned from the API
 */
export interface RankingResource extends BaseResource {
  id: number;
  userId: number;
  totalScore: number;
  quizzesCompleted: number;
  level: string;
  country: string;
  lastActivity: string;
  userName?: string; // Optional: user name from user profile
  userAvatar?: string; // Optional: user avatar URL
}
