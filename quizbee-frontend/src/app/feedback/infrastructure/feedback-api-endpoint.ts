import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Feedback} from '../domain/model/feedback.entity';
import {FeedbackResponse} from '../domain/model/feedback-response.entity';
import {FeedbacksResponse, FeedbackResource, FeedbackResponsesResponse, FeedbackResponseResource} from './feedback-response';
import {FeedbackAssembler} from './feedback-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class FeedbackApiEndpoint extends BaseApiEndpoint<Feedback, FeedbackResource, FeedbacksResponse, FeedbackAssembler> {

  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}/feedback`, new FeedbackAssembler());
  }

  // Custom methods for feedback
  getFeedbackByQuizId(quizId: number): Observable<Feedback[]> {
    return this.http.get<FeedbacksResponse>(`${this.endpointUrl}/quiz/${quizId}`).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response))
    );
  }

  getFeedbackByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<FeedbacksResponse>(`${this.endpointUrl}/user/${userId}`).pipe(
      map(response => this.assembler.toEntitiesFromResponse(response))
    );
  }

  // Methods for FeedbackResponse
  getResponsesByFeedbackId(feedbackId: number): Observable<FeedbackResponse[]> {
    return this.http.get<FeedbackResponsesResponse>(`${this.endpointUrl}/${feedbackId}/responses`).pipe(
      map(response => (this.assembler as FeedbackAssembler).toResponseEntitiesFromResponse(response))
    );
  }

  createResponse(response: FeedbackResponse): Observable<FeedbackResponse> {
    const resource = (this.assembler as FeedbackAssembler).toResponseResourceFromEntity(response);
    return this.http.post<FeedbackResponseResource>(`${this.endpointUrl}/${response.feedbackId}/responses`, resource).pipe(
      map(created => (this.assembler as FeedbackAssembler).toResponseEntityFromResource(created))
    );
  }
}
