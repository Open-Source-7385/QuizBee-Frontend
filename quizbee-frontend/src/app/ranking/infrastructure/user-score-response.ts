import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

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
