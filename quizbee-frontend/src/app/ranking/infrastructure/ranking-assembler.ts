import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Ranking} from '../domain/model/ranking.entity';
import {RankingResponse, RankingResource} from './ranking-response';

export class RankingAssembler implements BaseAssembler<Ranking, RankingResource, RankingResponse> {

  toEntitiesFromResponse(response: RankingResponse): Ranking[] {
    return response.rankings.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: RankingResource): Ranking {
    return new Ranking({
      id: resource.id,
      userId: resource.userId,
      quizId: resource.quizId,
      score: resource.score,
      timeSpent: resource.timeSpent,
      completedAt: resource.completedAt
    });
  }

  toResourceFromEntity(entity: Ranking): RankingResource {
    return {
      id: entity.id,
      userId: entity.userId,
      quizId: entity.quizId,
      score: entity.score,
      timeSpent: entity.timeSpent,
      completedAt: entity.completedAt.toISOString()
    } as RankingResource;
  }
}
