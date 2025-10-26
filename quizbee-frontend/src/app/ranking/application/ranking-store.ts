import {Injectable, computed, signal, Signal} from '@angular/core';
import {Ranking} from '../domain/model/ranking.entity';
import {Leaderboard} from '../domain/model/leaderboard.entity';
import {UserScore} from '../domain/model/user-score.entity';
import {RankingApi} from '../infrastructure/ranking-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingStore {
  private readonly rankingsSignal = signal<Ranking[]>([]);
  private readonly leaderboardsSignal = signal<Leaderboard[]>([]);
  private readonly userScoresSignal = signal<UserScore[]>([]);

  readonly rankings = this.rankingsSignal.asReadonly();
  readonly leaderboards = this.leaderboardsSignal.asReadonly();
  readonly userScores = this.userScoresSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly rankingCount = computed(() => this.rankings().length);
  readonly leaderboardCount = computed(() => this.leaderboards().length);
  readonly userScoreCount = computed(() => this.userScores().length);

  constructor(private rankingApi: RankingApi) {
    this.loadRankings();
    this.loadLeaderboards();
    this.loadUserScores();
  }

  // Ranking methods
  getRankingById(id: number | null | undefined): Signal<Ranking | undefined> {
    return computed(() => id ? this.rankings().find(r => r.id === id) : undefined);
  }

  addRanking(ranking: Ranking): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.createRanking(ranking).pipe(retry(2)).subscribe({
      next: createdRanking => {
        this.rankingsSignal.update(rankings => [...rankings, createdRanking]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create ranking'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateRanking(updatedRanking: Ranking): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.updateRanking(updatedRanking).pipe(retry(2)).subscribe({
      next: ranking => {
        this.rankingsSignal.update(rankings =>
          rankings.map(r => r.id === ranking.id ? ranking : r)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update ranking'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteRanking(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.deleteRanking(id).pipe(retry(2)).subscribe({
      next: () => {
        this.rankingsSignal.update(rankings => rankings.filter(r => r.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete ranking'));
        this.loadingSignal.set(false);
      }
    });
  }

  // Leaderboard methods
  getLeaderboardById(id: number | null | undefined): Signal<Leaderboard | undefined> {
    return computed(() => id ? this.leaderboards().find(l => l.id === id) : undefined);
  }

  addLeaderboard(leaderboard: Leaderboard): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.createLeaderboard(leaderboard).pipe(retry(2)).subscribe({
      next: createdLeaderboard => {
        this.leaderboardsSignal.update(leaderboards => [...leaderboards, createdLeaderboard]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create leaderboard'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateLeaderboard(updatedLeaderboard: Leaderboard): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.updateLeaderboard(updatedLeaderboard).pipe(retry(2)).subscribe({
      next: leaderboard => {
        this.leaderboardsSignal.update(leaderboards =>
          leaderboards.map(l => l.id === leaderboard.id ? leaderboard : l)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update leaderboard'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteLeaderboard(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.deleteLeaderboard(id).pipe(retry(2)).subscribe({
      next: () => {
        this.leaderboardsSignal.update(leaderboards => leaderboards.filter(l => l.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete leaderboard'));
        this.loadingSignal.set(false);
      }
    });
  }

  // UserScore methods
  getUserScoreById(id: number | null | undefined): Signal<UserScore | undefined> {
    return computed(() => id ? this.userScores().find(us => us.id === id) : undefined);
  }

  addUserScore(userScore: UserScore): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.createUserScore(userScore).pipe(retry(2)).subscribe({
      next: createdUserScore => {
        this.userScoresSignal.update(userScores => [...userScores, createdUserScore]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create user score'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateUserScore(updatedUserScore: UserScore): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.updateUserScore(updatedUserScore).pipe(retry(2)).subscribe({
      next: userScore => {
        this.userScoresSignal.update(userScores =>
          userScores.map(us => us.id === userScore.id ? userScore : us)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update user score'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteUserScore(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.deleteUserScore(id).pipe(retry(2)).subscribe({
      next: () => {
        this.userScoresSignal.update(userScores => userScores.filter(us => us.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete user score'));
        this.loadingSignal.set(false);
      }
    });
  }

  // Private load methods
  private loadRankings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.getRankings().pipe(takeUntilDestroyed()).subscribe({
      next: rankings => {
        this.rankingsSignal.set(rankings);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load rankings'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadLeaderboards(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.getLeaderboards().pipe(takeUntilDestroyed()).subscribe({
      next: leaderboards => {
        this.leaderboardsSignal.set(leaderboards);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load leaderboards'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadUserScores(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.getUserScores().pipe(takeUntilDestroyed()).subscribe({
      next: userScores => {
        this.userScoresSignal.set(userScores);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load user scores'));
        this.loadingSignal.set(false);
      }
    });
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
