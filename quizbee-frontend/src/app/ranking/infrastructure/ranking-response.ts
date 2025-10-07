import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for a list of rankings.
 */
export interface RankingResponse extends BaseResponse {
  /**
   * The list of rankings returned by the API.
   */
  rankings: RankingResource[];
}

/**
 * Represents the API resource/DTO for a ranking entry.
 */
export interface RankingResource extends BaseResource {
  id: number;
  userId: number;
  userName: string;
  score: number;
  level: string;
  country?: string;
  quizCount: number;
  averageScore: number;
  rankPosition: number;
  updatedAt: string;
}
