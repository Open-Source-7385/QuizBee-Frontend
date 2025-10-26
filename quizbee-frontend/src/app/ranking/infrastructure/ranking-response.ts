import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface RankingResponse extends BaseResponse {
  rankings: RankingResource[];
}

export interface RankingResource extends BaseResource {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  timeSpent: number;
  completedAt: string;
}

export interface LeaderboardResponse extends BaseResponse {
  leaderboards: LeaderboardResource[];
}

export interface LeaderboardResource extends BaseResource {
  id: number;
  name: string;
  type: string; // 'global', 'weekly', 'monthly'
  startDate: string;
  endDate: string;
}

export interface UserScoreResponse extends BaseResponse {
  userScores: UserScoreResource[];
}

export interface UserScoreResource extends BaseResource {
  id: number;
  userId: number;
  totalScore: number;
  averageScore: number;
  quizzesCompleted: number;
  rank: number;
}
