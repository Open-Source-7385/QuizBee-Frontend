import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AttemptHistoryStore } from '../../../application/attempt-history-store';
import { QuizAttempt } from '../../../domain/model/quiz-attempt.entity';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attempt-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './attempt-history.html',
  styleUrls: ['./attempt-history.css']
})
export class AttemptHistoryComponent implements OnInit {
  private readonly attemptHistoryStore = inject(AttemptHistoryStore);

  // Signals from store
  readonly attempts = this.attemptHistoryStore.attempts;
  readonly loading = this.attemptHistoryStore.loading;
  readonly error = this.attemptHistoryStore.error;
  readonly totalAttempts = this.attemptHistoryStore.totalAttempts;
  readonly averageScore = this.attemptHistoryStore.averageScore;
  readonly successRate = this.attemptHistoryStore.successRate;

  // Local state
  readonly filterStatus = signal<'all' | 'completed' | 'abandoned' | 'timed_out'>('all');
  readonly sortBy = signal<'date' | 'score' | 'time'>('date');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');
  readonly searchTerm = signal<string>('');

  // Computed values for filtered and sorted attempts
  readonly filteredAttempts = computed(() => {
    let attempts = this.attempts();

    // Filter by status
    if (this.filterStatus() !== 'all') {
      attempts = attempts.filter(attempt => attempt.status === this.filterStatus());
    }

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      attempts = attempts.filter(attempt =>
        attempt.difficultyLevel.toLowerCase().includes(term) ||
        attempt.status.toLowerCase().includes(term)
      );
    }

    // Sort attempts
    attempts = [...attempts].sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy()) {
        case 'date':
          comparison = a.completedAt.getTime() - b.completedAt.getTime();
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'time':
          comparison = a.timeSpent - b.timeSpent;
          break;
      }

      return this.sortOrder() === 'desc' ? -comparison : comparison;
    });

    return attempts;
  });

  // Statistics computed from filtered attempts
  readonly filteredStats = computed(() => {
    const attempts = this.filteredAttempts();
    const total = attempts.length;

    if (total === 0) {
      return {
        averageScore: 0,
        averageTime: 0,
        successRate: 0,
        statusCounts: { completed: 0, abandoned: 0, timed_out: 0 }
      };
    }

    const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / total;
    const averageTime = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / total;
    const successRate = (attempts.filter(attempt => attempt.calculateSuccessRate() >= 60).length / total) * 100;

    const statusCounts = {
      completed: attempts.filter(attempt => attempt.status === 'completed').length,
      abandoned: attempts.filter(attempt => attempt.status === 'abandoned').length,
      timed_out: attempts.filter(attempt => attempt.status === 'timed_out').length
    };

    return { averageScore, averageTime, successRate, statusCounts };
  });

  ngOnInit() {
    // Load attempt history for the current user (you might get this from auth service)
    const currentUserId = 1; // Replace with actual user ID
    this.attemptHistoryStore.loadUserAttemptHistory(currentUserId);
  }

  onFilterStatusChange(status: 'all' | 'completed' | 'abandoned' | 'timed_out') {
    this.filterStatus.set(status);
  }

  onSortChange(sortBy: 'date' | 'score' | 'time') {
    if (this.sortBy() === sortBy) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(sortBy);
      this.sortOrder.set('desc');
    }
  }

  onSearchTermChange(term: string) {
    this.searchTerm.set(term);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'abandoned': return 'status-abandoned';
      case 'timed_out': return 'status-timed-out';
      default: return 'status-unknown';
    }
  }

  getDifficultyBadgeClass(difficulty: string): string {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return 'difficulty-unknown';
    }
  }

  retryLoad() {
    const currentUserId = 1;
    this.attemptHistoryStore.loadUserAttemptHistory(currentUserId);
  }
}
