import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AttemptHistoryStore } from '../../../application/attempt-history-store';
import { QuizAttempt } from '../../../domain/model/quiz-attempt.entity';
import { QuizScore } from '../../../domain/model/quiz-score';
import { TimeMetrics } from '../../../domain/model/time-metrics';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz-results.html',
  styleUrls: ['./quiz-results.css']
})
export class QuizResultsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly attemptHistoryStore = inject(AttemptHistoryStore);

  readonly attempt = signal<QuizAttempt | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // Value objects for display
  readonly quizScore = signal<QuizScore | null>(null);
  readonly timeMetrics = signal<TimeMetrics | null>(null);

  ngOnInit() {
    const attemptId = this.route.snapshot.paramMap.get('attemptId');

    if (!attemptId) {
      this.error.set('No attempt ID provided');
      this.loading.set(false);
      return;
    }

    this.loadAttemptDetails(parseInt(attemptId, 10));
  }

  private loadAttemptDetails(attemptId: number) {
    // In a real app, you'd fetch the specific attempt from the API
    // For now, we'll find it in the store's attempts
    const attempts = this.attemptHistoryStore.attempts();
    const foundAttempt = attempts.find(attempt => attempt.id === attemptId);

    if (foundAttempt) {
      this.attempt.set(foundAttempt);
      this.quizScore.set(QuizScore.calculate(foundAttempt.score, foundAttempt.totalQuestions));
      this.timeMetrics.set(TimeMetrics.calculate(foundAttempt.timeSpent, foundAttempt.totalQuestions));
      this.loading.set(false);
    } else {
      // If not found in store, try to load user history
      const currentUserId = 1;
      this.attemptHistoryStore.loadUserAttemptHistory(currentUserId);

      // Simulate waiting for data load
      setTimeout(() => {
        const updatedAttempts = this.attemptHistoryStore.attempts();
        const updatedAttempt = updatedAttempts.find(attempt => attempt.id === attemptId);

        if (updatedAttempt) {
          this.attempt.set(updatedAttempt);
          this.quizScore.set(QuizScore.calculate(updatedAttempt.score, updatedAttempt.totalQuestions));
          this.timeMetrics.set(TimeMetrics.calculate(updatedAttempt.timeSpent, updatedAttempt.totalQuestions));
        } else {
          this.error.set('Quiz attempt not found');
        }
        this.loading.set(false);
      }, 1000);
    }
  }

  getPerformanceMessage(score: number): string {
    if (score >= 90) return 'Outstanding! Perfect performance!';
    if (score >= 80) return 'Excellent work! You mastered this material.';
    if (score >= 70) return 'Good job! Solid understanding demonstrated.';
    if (score >= 60) return 'Well done! You passed with a good score.';
    if (score >= 50) return 'Not bad! Review the material and try again.';
    return 'Keep practicing! Review the material and retake the quiz.';
  }

  getPerformanceColor(score: number): string {
    if (score >= 80) return 'performance-excellent';
    if (score >= 60) return 'performance-good';
    if (score >= 50) return 'performance-average';
    return 'performance-poor';
  }

  getDifficultyIcon(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return '🌱';
      case 'intermediate': return '⚡';
      case 'advanced': return '🚀';
      default: return '📚';
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  retakeQuiz() {
    if (this.attempt()) {
      this.router.navigate(['/quiz', this.attempt()!.quizId]);
    }
  }

  viewHistory() {
    this.router.navigate(['/feedback/attempts']);
  }

  getPerformanceTier(score: number): string {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 70) return 'Proficient';
    if (score >= 60) return 'Competent';
    if (score >= 50) return 'Novice';
    return 'Beginner';
  }
}
