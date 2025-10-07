import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Ranking} from '../domain/model/ranking.entity';
import {RankingResource, RankingResponse} from './ranking-response';

export class RankingAssembler implements BaseAssembler<Ranking, RankingResource, RankingResponse> {

  /**
   * Converts a RankingResponse to an array of Ranking entities.
   * @param response - The API response containing rankings.
   * @returns An array of Ranking entities.
   */
  toEntitiesFromResponse(response: RankingResponse): Ranking[] {
    return response.rankings.map(resource => this.toEntityFromResource(resource as RankingResource));
  }

  /**
   * Converts a RankingResource to a Ranking entity.
   * @param resource - The resource to convert.
   * @returns The converted Ranking entity.
   */
  toEntityFromResource(resource: RankingResource): Ranking {
    return new Ranking({
      id: resource.id,
      userId: resource.userId,
      userName: resource.userName,
      score: resource.score,
      level: resource.level,
      country: resource.country,
      quizCount: resource.quizCount,
      averageScore: resource.averageScore,
      rankPosition: resource.rankPosition,
      updatedAt: resource.updatedAt
    });
  }

  /**
   * Converts a Ranking entity to a RankingResource.
   * @param entity - The entity to convert.
   * @returns The converted RankingResource.
   */
  toResourceFromEntity(entity: Ranking): RankingResource {
    return {
      id: entity.id,
      userId: entity.userId,
      userName: entity.userName,
      score: entity.score,
      level: entity.level,
      country: entity.country,
      quizCount: entity.quizCount,
      averageScore: entity.averageScore,
      rankPosition: entity.rankPosition,
      updatedAt: entity.updatedAt
    } as RankingResource;
  }
}
