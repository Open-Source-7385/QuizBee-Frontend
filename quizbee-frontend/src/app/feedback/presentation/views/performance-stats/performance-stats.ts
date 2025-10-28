import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttemptHistoryStore } from '../../../application/attempt-history-store';

@Component({
  selector: 'app-performance-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './performance-stats.html',
  styleUrls: ['./performance-stats.css']
})
export class PerformanceStatsComponent implements OnInit {
  private readonly attemptHistoryStore = inject(AttemptHistoryStore);

  readonly attempts = this.attemptHistoryStore.attempts;
  readonly userStats = this.attemptHistoryStore.userStats;
  readonly loading = this.attemptHistoryStore.loading;
  readonly error = this.attemptHistoryStore.error;

  // Comprehensive performance metrics
  readonly performanceMetrics = computed(() => {
    const attempts = this.attempts();
    const total = attempts.length;

    if (total === 0) {
      return null;
    }

    // Score analysis
    const scores = attempts.map(a => a.score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / total;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    // Time analysis
    const times = attempts.map(a => a.timeSpent);
    const averageTime = times.reduce((sum, time) => sum + time, 0) / total;
    const totalTime = times.reduce((sum, time) => sum + time, 0);

    // Success rate by difficulty
    const difficultyStats = attempts.reduce((acc, attempt) => {
      const level = attempt.difficultyLevel;
      if (!acc[level]) {
        acc[level] = { total: 0, successful: 0, totalTime: 0 };
      }
      acc[level].total++;
      if (attempt.calculateSuccessRate() >= 60) {
        acc[level].successful++;
      }
      acc[level].totalTime += attempt.timeSpent;
      return acc;
    }, {} as any);

    // Weekly progress
    const weeklyProgress = this.calculateWeeklyProgress(attempts);

    return {
      overall: {
        totalAttempts: total,
        averageScore,
        maxScore,
        minScore,
        averageTime,
        totalTime,
        successRate: (attempts.filter(a => a.calculateSuccessRate() >= 60).length / total) * 100
      },
      byDifficulty: difficultyStats,
      weeklyProgress,
      improvement: this.calculateImprovement(attempts)
    };
  });

  ngOnInit() {
    const currentUserId = 1;
    this.attemptHistoryStore.loadUserAttemptHistory(currentUserId);
    this.attemptHistoryStore.loadUserStatistics(currentUserId);
  }

  private calculateWeeklyProgress(attempts: any[]): any[] {
    // Group attempts by week and calculate weekly averages
    const weeklyData = attempts.reduce((acc, attempt) => {
      const week = this.getWeekNumber(attempt.completedAt);
      const year = attempt.completedAt.getFullYear();
      const key = `${year}-W${week}`;

      if (!acc[key]) {
        acc[key] = { attempts: [], week: key };
      }
      acc[key].attempts.push(attempt);
      return acc;
    }, {} as any);

    return Object.values(weeklyData).map((week: any) => {
      const scores = week.attempts.map((a: any) => a.calculateSuccessRate());
      const averageScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      return {
        week: week.week,
        averageScore,
        attemptCount: week.attempts.length
      };
    }).slice(-8); // Last 8 weeks
  }

  private calculateImprovement(attempts: any[]): any {
    if (attempts.length < 2) return { trend: 'stable', percentage: 0 };

    const sorted = [...attempts].sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime());
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

    const firstAvg = firstHalf.reduce((sum, a) => sum + a.calculateSuccessRate(), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, a) => sum + a.calculateSuccessRate(), 0) / secondHalf.length;

    const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;

    return {
      trend: improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
      percentage: Math.abs(improvement)
    };
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'improving': return 'trend-improving';
      case 'declining': return 'trend-declining';
      default: return 'trend-stable';
    }
  }

  retryLoad() {
    const currentUserId = 1;
    this.attemptHistoryStore.loadUserAttemptHistory(currentUserId);
    this.attemptHistoryStore.loadUserStatistics(currentUserId);
  }

  getObjectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
