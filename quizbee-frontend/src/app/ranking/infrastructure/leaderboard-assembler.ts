import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Leaderboard} from '../domain/model/leaderboard.entity';
import {LeaderboardResponse, LeaderboardResource} from './ranking-response';

export class LeaderboardAssembler implements BaseAssembler<Leaderboard, LeaderboardResource, LeaderboardResponse> {

  toEntitiesFromResponse(response: LeaderboardResponse): Leaderboard[] {
    return response.leaderboards.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: LeaderboardResource): Leaderboard {
    return new Leaderboard({
      id: resource.id,
      name: resource.name,
      type: resource.type,
      startDate: resource.startDate,
      endDate: resource.endDate
    });
  }

  toResourceFromEntity(entity: Leaderboard): LeaderboardResource {
    return {
      id: entity.id,
      name: entity.name,
      type: entity.type,
      startDate: entity.startDate.toISOString(),
      endDate: entity.endDate.toISOString()
    } as LeaderboardResource;
  }
}
