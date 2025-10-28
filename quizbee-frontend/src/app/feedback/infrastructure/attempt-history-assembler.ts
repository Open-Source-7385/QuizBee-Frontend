import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { QuizAttempt } from '../domain/model/quiz-attempt.entity';
import { AttemptHistoryResponse, AttemptHistoryResource } from './attempt-history-response';

export class AttemptHistoryAssembler implements BaseAssembler<QuizAttempt, AttemptHistoryResource, AttemptHistoryResponse> {

  /**
   * Converts an AttemptHistoryResponse to an array of QuizAttempt entities.
   * @param response - The API response containing attempts.
   * @returns An array of QuizAttempt entities.
   */
  toEntitiesFromResponse(response: AttemptHistoryResponse): QuizAttempt[] {
    return response.attempts.map(resource => this.toEntityFromResource(resource as AttemptHistoryResource));
  }

  /**
   * Converts an AttemptHistoryResource to a QuizAttempt entity.
   * @param resource - The resource to convert.
   * @returns The converted QuizAttempt entity.
   */
  toEntityFromResource(resource: AttemptHistoryResource): QuizAttempt {
    return new QuizAttempt({
      id: resource.id,
      userId: resource.userId,
      quizId: resource.quizId,
      score: resource.score,
      totalQuestions: resource.totalQuestions,
      correctAnswers: resource.correctAnswers,
      timeSpent: resource.timeSpent,
      completedAt: new Date(resource.completedAt),
      difficultyLevel: resource.difficultyLevel,
      status: resource.status
    });
  }

  /**
   * Converts a QuizAttempt entity to an AttemptHistoryResource.
   * @param entity - The entity to convert.
   * @returns The converted AttemptHistoryResource.
   */
  toResourceFromEntity(entity: QuizAttempt): AttemptHistoryResource {
    return {
      id: entity.id,
      userId: entity.userId,
      quizId: entity.quizId,
      score: entity.score,
      totalQuestions: entity.totalQuestions,
      correctAnswers: entity.correctAnswers,
      timeSpent: entity.timeSpent,
      completedAt: entity.completedAt.toISOString(),
      difficultyLevel: entity.difficultyLevel,
      status: entity.status
    } as AttemptHistoryResource;
  }
}
