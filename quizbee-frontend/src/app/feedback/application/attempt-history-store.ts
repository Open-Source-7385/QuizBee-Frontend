import { computed, Signal, signal } from '@angular/core';
import { QuizAttempt } from '../domain/model/quiz-attempt.entity';
import { FeedbackApi } from '../infrastructure/feedback-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttemptHistoryStore {
  private readonly attemptsSignal = signal<QuizAttempt[]>([]);
  private readonly userStatsSignal = signal<any>(null);

  readonly attempts = this.attemptsSignal.asReadonly();
  readonly userStats = this.userStatsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  // Computed values
  readonly totalAttempts = computed(() => this.attempts().length);
  readonly averageScore = computed(() => {
    const attempts = this.attempts();
    if (attempts.length === 0) return 0;
    return attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length;
  });

  readonly successRate = computed(() => {
    const attempts = this.attempts();
    if (attempts.length === 0) return 0;
    const successful = attempts.filter(attempt => attempt.calculateSuccessRate() >= 60).length;
    return (successful / attempts.length) * 100;
  });

  constructor(private feedbackApi: FeedbackApi) {}

  /**
   * Loads attempt history for a specific user.
   * @param userId - The ID of the user.
   */
  loadUserAttemptHistory(userId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.feedbackApi.getAttemptHistoryByUser(userId)
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: attempts => {
          this.attemptsSignal.set(attempts);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load attempt history'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads attempts for a specific quiz.
   * @param quizId - The ID of the quiz.
   */
  loadQuizAttempts(quizId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.feedbackApi.getAttemptsByQuiz(quizId)
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: attempts => {
          this.attemptsSignal.set(attempts);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load quiz attempts'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Records a new quiz attempt.
   * @param attempt - The quiz attempt to record.
   */
  recordAttempt(attempt: QuizAttempt): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.feedbackApi.recordQuizAttempt(attempt)
      .pipe(retry(2))
      .subscribe({
        next: recordedAttempt => {
          this.attemptsSignal.update(attempts => [...attempts, recordedAttempt]);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to record attempt'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads performance statistics for a user.
   * @param userId - The ID of the user.
   */
  loadUserStatistics(userId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.feedbackApi.getUserPerformanceStats(userId)
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: stats => {
          this.userStatsSignal.set(stats);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load user statistics'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Filters attempts by status.
   * @param status - The status to filter by.
   * @returns A Signal containing filtered attempts.
   */
  getAttemptsByStatus(status: 'completed' | 'abandoned' | 'timed_out'): Signal<QuizAttempt[]> {
    return computed(() => this.attempts().filter(attempt => attempt.status === status));
  }

  /**
   * Gets attempts within a date range.
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns A Signal containing filtered attempts.
   */
  getAttemptsByDateRange(startDate: Date, endDate: Date): Signal<QuizAttempt[]> {
    return computed(() =>
      this.attempts().filter(attempt =>
        attempt.completedAt >= startDate && attempt.completedAt <= endDate
      )
    );
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
