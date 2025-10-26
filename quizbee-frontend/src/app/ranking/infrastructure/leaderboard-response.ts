import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

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
