import {computed, Signal, signal} from '@angular/core';
import {Feedback} from '../domain/model/feedback.entity';
import {FeedbackResponse} from '../domain/model/feedback-response.entity';
import {FeedbackApi} from '../infrastructure/feedback-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

export class FeedbackStore {
  private readonly feedbacksSignal = signal<Feedback[]>([]);
  private readonly feedbackResponsesSignal = signal<FeedbackResponse[]>([]);

  readonly feedbacks = this.feedbacksSignal.asReadonly();
  readonly feedbackResponses = this.feedbackResponsesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly feedbackCount = computed(() => this.feedbacks().length);
  readonly averageRating = computed(() => {
    const feedbacks = this.feedbacks();
    if (feedbacks.length === 0) return 0;
    return feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length;
  });


  constructor(private feedbackApi: FeedbackApi) {
    this.loadFeedbacks();
  }

  /**
   * Loads feedback for a specific quiz.
   * @param quizId - The ID of the quiz.
   */
  loadFeedbackForQuiz(quizId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.feedbackApi.getFeedbackByQuizId(quizId).pipe(takeUntilDestroyed()).subscribe({
      next: feedbacks => {
        this.feedbacksSignal.set(feedbacks);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load feedback'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Adds new feedback.
   * @param feedback - The feedback to add.
   */
  addFeedback(feedback: Feedback): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.feedbackApi.createFeedback(feedback).pipe(retry(2)).subscribe({
      next: createdFeedback => {
        this.feedbacksSignal.update(feedbacks => [...feedbacks, createdFeedback]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create feedback'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates existing feedback.
   * @param updatedFeedback - The feedback to update.
   */
  updateFeedback(updatedFeedback: Feedback): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.feedbackApi.updateFeedback(updatedFeedback).pipe(retry(2)).subscribe({
      next: feedback => {
        this.feedbacksSignal.update(feedbacks =>
          feedbacks.map(f => f.id === feedback.id ? feedback : f)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update feedback'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes feedback by ID.
   * @param id - The ID of the feedback to delete.
   */
  deleteFeedback(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.feedbackApi.deleteFeedback(id).pipe(retry(2)).subscribe({
      next: () => {
        this.feedbacksSignal.update(feedbacks => feedbacks.filter(f => f.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete feedback'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads responses for a specific feedback.
   * @param feedbackId - The ID of the feedback.
   */
  loadFeedbackResponses(feedbackId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.feedbackApi.getFeedbackResponses(feedbackId).pipe(takeUntilDestroyed()).subscribe({
      next: responses => {
        this.feedbackResponsesSignal.set(responses);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load feedback responses'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Adds a response to feedback.
   * @param response - The response to add.
   */
  addFeedbackResponse(response: FeedbackResponse): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.feedbackApi.createFeedbackResponse(response).pipe(retry(2)).subscribe({
      next: createdResponse => {
        this.feedbackResponsesSignal.update(responses => [...responses, createdResponse]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create feedback response'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all feedbacks from the API.
   */
  private loadFeedbacks(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.feedbackApi.getFeedbacks().pipe(takeUntilDestroyed()).subscribe({
      next: feedbacks => {
        this.feedbacksSignal.set(feedbacks);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load feedbacks'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
