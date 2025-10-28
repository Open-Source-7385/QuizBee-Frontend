import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for a list of quiz attempts.
 */
export interface AttemptHistoryResponse extends BaseResponse {
  /**
   * The list of quiz attempts returned by the API.
   */
  attempts: AttemptHistoryResource[];
}

/**
 * Represents the API resource/DTO for a quiz attempt.
 */
export interface AttemptHistoryResource extends BaseResource {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string; // ISO string
  difficultyLevel: string;
  status: 'completed' | 'abandoned' | 'timed_out';
}
