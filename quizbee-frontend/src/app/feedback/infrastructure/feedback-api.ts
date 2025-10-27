import { BaseApi } from '../../shared/infrastructure/base-api';
import { QuizAttempt } from '../domain/model/quiz-attempt.entity';
import { HttpClient } from '@angular/common/http';
import { AttemptHistoryApiEndpoint } from './attempt-history-api-endpoint';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeedbackApi extends BaseApi {
  private readonly attemptHistoryEndpoint: AttemptHistoryApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.attemptHistoryEndpoint = new AttemptHistoryApiEndpoint(http);
  }

  /**
   * Retrieves attempt history for a specific user.
   * @param userId - The ID of the user.
   * @returns An Observable for an array of QuizAttempt objects.
   */
  getAttemptHistoryByUser(userId: number): Observable<QuizAttempt[]> {
    return this.attemptHistoryEndpoint.getByUserId(userId);
  }

  /**
   * Retrieves attempts for a specific quiz.
   * @param quizId - The ID of the quiz.
   * @returns An Observable for an array of QuizAttempt objects.
   */
  getAttemptsByQuiz(quizId: number): Observable<QuizAttempt[]> {
    return this.attemptHistoryEndpoint.getByQuizId(quizId);
  }

  /**
   * Records a new quiz attempt.
   * @param attempt - The quiz attempt to record.
   * @returns An Observable of the recorded QuizAttempt object.
   */
  recordQuizAttempt(attempt: QuizAttempt): Observable<QuizAttempt> {
    return this.attemptHistoryEndpoint.recordAttempt(attempt);
  }

  /**
   * Retrieves performance statistics for a user.
   * @param userId - The ID of the user.
   * @returns An Observable of performance statistics.
   */
  getUserPerformanceStats(userId: number): Observable<any> {
    return this.attemptHistoryEndpoint.getUserStatistics(userId);
  }
}
