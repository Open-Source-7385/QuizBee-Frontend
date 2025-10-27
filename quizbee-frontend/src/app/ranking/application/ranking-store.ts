import { Injectable, inject } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { Ranking } from '../domain/model/ranking.entity';
import { RankingPosition } from '../domain/model/ranking-position';
import { RankingApi } from '../infrastructure/ranking-api';
import { RankingAssembler } from '../infrastructure/ranking-assembler';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingStore {
  private readonly rankingApi = inject(RankingApi);
  private readonly rankingAssembler = new RankingAssembler();

  // State signals
  private readonly globalRankingSignal = signal<Ranking[]>([]);
  private readonly levelRankingSignal = signal<Ranking[]>([]);
  private readonly countryRankingSignal = signal<Ranking[]>([]);
  private readonly userRankingSignal = signal<Ranking | null>(null);

  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly globalRanking = this.globalRankingSignal.asReadonly();
  readonly levelRanking = this.levelRankingSignal.asReadonly();
  readonly countryRanking = this.countryRankingSignal.asReadonly();
  readonly userRanking = this.userRankingSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed signals for ranking positions
  readonly globalRankingPositions = computed(() =>
    this.rankingAssembler.toRankingPositionsFromEntities(this.globalRanking())
  );

  readonly levelRankingPositions = computed(() =>
    this.rankingAssembler.toRankingPositionsFromEntities(this.levelRanking())
  );

  readonly countryRankingPositions = computed(() =>
    this.rankingAssembler.toRankingPositionsFromEntities(this.countryRanking())
  );

  readonly userPosition = computed(() => {
    const userRanking = this.userRanking();
    if (!userRanking) return null;

    const positions = this.globalRankingPositions();
    return positions.find(pos => pos.userId === userRanking.userId) || null;
  });

  /**
   * Loads global ranking
   */
  loadGlobalRanking(page: number = 1, limit: number = 50): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.rankingApi.getGlobalRanking(page, limit)
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: rankings => {
          this.globalRankingSignal.set(rankings);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load global ranking'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads ranking by level
   */
  loadRankingByLevel(level: string, page: number = 1, limit: number = 50): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.rankingApi.getRankingByLevel(level, page, limit)
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: rankings => {
          this.levelRankingSignal.set(rankings);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load level ranking'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads ranking by country
   */
  loadRankingByCountry(country: string, page: number = 1, limit: number = 50): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.rankingApi.getRankingByCountry(country, page, limit)
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: rankings => {
          this.countryRankingSignal.set(rankings);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load country ranking'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Loads user's ranking
   */
  loadUserRanking(userId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.rankingApi.getUserRanking(userId)
      .pipe(takeUntilDestroyed(), retry(2))
      .subscribe({
        next: ranking => {
          this.userRankingSignal.set(ranking);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load user ranking'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Updates user ranking after quiz completion
   */
  updateUserRanking(userId: number, score: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.rankingApi.updateUserRanking(userId, score)
      .pipe(retry(2))
      .subscribe({
        next: ranking => {
          this.userRankingSignal.set(ranking);
          // Refresh global ranking to reflect changes
          this.loadGlobalRanking();
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to update ranking'));
          this.loadingSignal.set(false);
        }
      });
  }

  /**
   * Formats error messages
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
