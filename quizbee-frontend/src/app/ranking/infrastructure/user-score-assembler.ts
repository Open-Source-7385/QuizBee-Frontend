import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {UserScore} from '../domain/model/user-score.entity';
import {UserScoreResponse, UserScoreResource} from './ranking-response';

export class UserScoreAssembler implements BaseAssembler<UserScore, UserScoreResource, UserScoreResponse> {

  toEntitiesFromResponse(response: UserScoreResponse): UserScore[] {
    return response.userScores.map(resource => this.toEntityFromResource(resource));
  }

  toEntityFromResource(resource: UserScoreResource): UserScore {
    return new UserScore({
      id: resource.id,
      userId: resource.userId,
      totalScore: resource.totalScore,
      averageScore: resource.averageScore,
      quizzesCompleted: resource.quizzesCompleted,
      rank: resource.rank
    });
  }

  toResourceFromEntity(entity: UserScore): UserScoreResource {
    return {
      id: entity.id,
      userId: entity.userId,
      totalScore: entity.totalScore,
      averageScore: entity.averageScore,
      quizzesCompleted: entity.quizzesCompleted,
      rank: entity.rank
    } as UserScoreResource;
  }
}
