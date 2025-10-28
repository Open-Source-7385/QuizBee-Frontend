import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { QuizAttempt } from '../domain/model/quiz-attempt.entity';
import { AttemptHistoryResponse, AttemptHistoryResource } from './attempt-history-response';
import { AttemptHistoryAssembler } from './attempt-history-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // Added missing RxJS operators

export class AttemptHistoryApiEndpoint extends BaseApiEndpoint<
  QuizAttempt,
  AttemptHistoryResource,
  AttemptHistoryResponse,
  AttemptHistoryAssembler
> {

  /**
   * Creates an instance of AttemptHistoryApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}/api/v1/attempts`,
      new AttemptHistoryAssembler()
    );
  }

  /**
   * Retrieves attempt history for a specific user.
   * @param userId - The ID of the user.
   * @returns An Observable for an array of QuizAttempt entities.
   */
  getByUserId(userId: number): Observable<QuizAttempt[]> {
    return this.http.get<AttemptHistoryResponse>(`${this.endpointUrl}/user/${userId}`).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError('Failed to fetch user attempt history'))
    );
  }

  /**
   * Retrieves attempts for a specific quiz.
   * @param quizId - The ID of the quiz.
   * @returns An Observable for an array of QuizAttempt entities.
   */
  getByQuizId(quizId: number): Observable<QuizAttempt[]> {
    return this.http.get<AttemptHistoryResponse>(`${this.endpointUrl}/quiz/${quizId}`).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response)),
      catchError(this.handleError('Failed to fetch quiz attempts'))
    );
  }

  /**
   * Records a new quiz attempt.
   * @param attempt - The quiz attempt to record.
   * @returns An Observable of the recorded QuizAttempt entity.
   */
  recordAttempt(attempt: QuizAttempt): Observable<QuizAttempt> {
    const resource = this.assembler.toResourceFromEntity(attempt);
    return this.http.post<AttemptHistoryResource>(this.endpointUrl, resource).pipe(
      map(recorded => this.assembler.toEntityFromResource(recorded)),
      catchError(this.handleError('Failed to record quiz attempt'))
    );
  }

  /**
   * Retrieves performance statistics for a user.
   * @param userId - The ID of the user.
   * @returns An Observable of performance statistics.
   */
  getUserStatistics(userId: number): Observable<any> {
    return this.http.get<any>(`${this.endpointUrl}/stats/${userId}`).pipe(
      catchError(this.handleError('Failed to fetch user statistics'))
    );
  }
}
