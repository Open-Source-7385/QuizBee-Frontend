import {BaseApi} from '../../shared/infrastructure/base-api';
import {Feedback} from '../domain/model/feedback.entity';
import {FeedbackResponse} from '../domain/model/feedback-response.entity';
import {HttpClient} from '@angular/common/http';
import {FeedbackApiEndpoint} from './feedback-api-endpoint';
import {Observable} from 'rxjs';

export class FeedbackApi extends BaseApi {
  private readonly feedbackEndpoint: FeedbackApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.feedbackEndpoint = new FeedbackApiEndpoint(http);
  }

  /**
   * Retrieves all feedback from the API.
   * @returns An Observable for an array of Feedback objects.
   */
  getFeedbacks(): Observable<Feedback[]> {
    return this.feedbackEndpoint.getAll();
  }

  /**
   * Retrieves a single feedback by ID.
   * @param id - The ID of the feedback.
   * @returns An Observable of the Feedback object.
   */
  getFeedback(id: number): Observable<Feedback> {
    return this.feedbackEndpoint.getById(id);
  }

  /**
   * Creates new feedback.
   * @param feedback - The feedback to create.
   * @returns An Observable of the created Feedback object.
   */
  createFeedback(feedback: Feedback): Observable<Feedback> {
    return this.feedbackEndpoint.create(feedback);
  }

  /**
   * Updates existing feedback.
   * @param feedback - The feedback to update.
   * @returns An Observable of the updated Feedback object.
   */
  updateFeedback(feedback: Feedback): Observable<Feedback> {
    return this.feedbackEndpoint.update(feedback, feedback.id);
  }

  /**
   * Deletes feedback by ID.
   * @param id - The ID of the feedback to delete.
   * @returns An Observable of void.
   */
  deleteFeedback(id: number): Observable<void> {
    return this.feedbackEndpoint.delete(id);
  }

  /**
   * Retrieves feedback for a specific quiz.
   * @param quizId - The ID of the quiz.
   * @returns An Observable for an array of Feedback objects.
   */
  getFeedbackByQuizId(quizId: number): Observable<Feedback[]> {
    return this.feedbackEndpoint.getFeedbackByQuizId(quizId);
  }

  /**
   * Retrieves feedback given by a specific user.
   * @param userId - The ID of the user.
   * @returns An Observable for an array of Feedback objects.
   */
  getFeedbackByUserId(userId: number): Observable<Feedback[]> {
    return this.feedbackEndpoint.getFeedbackByUserId(userId);
  }

  /**
   * Retrieves responses for a specific feedback.
   * @param feedbackId - The ID of the feedback.
   * @returns An Observable for an array of FeedbackResponse objects.
   */
  getFeedbackResponses(feedbackId: number): Observable<FeedbackResponse[]> {
    return this.feedbackEndpoint.getResponsesByFeedbackId(feedbackId);
  }

  /**
   * Creates a response to feedback.
   * @param response - The response to create.
   * @returns An Observable of the created FeedbackResponse object.
   */
  createFeedbackResponse(response: FeedbackResponse): Observable<FeedbackResponse> {
    return this.feedbackEndpoint.createResponse(response);
  }
}
