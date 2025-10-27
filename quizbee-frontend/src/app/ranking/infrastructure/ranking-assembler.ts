import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Ranking } from '../domain/model/ranking.entity';
import {RankingPosition} from '../domain/model/ranking-position';
import { RankingResponse, RankingResource } from './ranking-response';

export class RankingAssembler implements BaseAssembler<Ranking, RankingResource, RankingResponse> {

  /**
   * Converts a RankingResponse to an array of Ranking entities
   */
  toEntitiesFromResponse(response: RankingResponse): Ranking[] {
    return response.rankings.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a RankingResource to a Ranking entity
   */
  toEntityFromResource(resource: RankingResource): Ranking {
    return new Ranking({
      id: resource.id,
      userId: resource.userId,
      totalScore: resource.totalScore,
      quizzesCompleted: resource.quizzesCompleted,
      level: resource.level,
      country: resource.country,
      lastActivity: new Date(resource.lastActivity)
    });
  }

  /**
   * Converts a Ranking entity to a RankingResource
   */
  toResourceFromEntity(entity: Ranking): RankingResource {
    return {
      id: entity.id,
      userId: entity.userId,
      totalScore: entity.totalScore,
      quizzesCompleted: entity.quizzesCompleted,
      level: entity.level,
      country: entity.country,
      lastActivity: entity.lastActivity.toISOString()
    } as RankingResource;
  }

  /**
   * Converts an array of Ranking entities to RankingPosition value objects
   */
  toRankingPositionsFromEntities(entities: Ranking[]): RankingPosition[] {
    const positions = entities.map(entity =>
      new RankingPosition(
        0, // position will be calculated
        entity.userId,
        entity.totalScore,
        entity.level,
        entity.country
      )
    );

    return RankingPosition.calculatePosition(positions);
  }
}
