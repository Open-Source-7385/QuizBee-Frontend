import { Injectable } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { Ranking } from '../domain/model/ranking.entity';
import { RankingApi } from '../infrastructure/ranking-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs'; // Added Observable import

@Injectable({
  providedIn: 'root'
})
export class RankingStore {
  private readonly globalRankingsSignal = signal<Ranking[]>([]);
  private readonly levelRankingsSignal = signal<Ranking[]>([]);
  private readonly countryRankingsSignal = signal<Ranking[]>([]);
  private readonly userRankingSignal = signal<Ranking | null>(null);

  readonly globalRankings = this.globalRankingsSignal.asReadonly();
  readonly levelRankings = this.levelRankingsSignal.asReadonly();
  readonly countryRankings = this.countryRankingsSignal.asReadonly();
  readonly userRanking = this.userRankingSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly topRankings = computed(() => this.globalRankings().slice(0, 10));
  readonly rankingCount = computed(() => this.globalRankings().length);

  constructor(private rankingApi: RankingApi) {
    this.loadGlobalRankings();
  }

  /**
   * Loads global rankings
   */
  loadGlobalRankings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.getGlobalRankings().pipe(takeUntilDestroyed()).subscribe({
      next: (rankings: Ranking[]) => { // Added type annotation
        this.globalRankingsSignal.set(rankings);
        this.loadingSignal.set(false);
      },
      error: (err: any) => { // Added type annotation
        this.errorSignal.set(this.formatError(err, 'Failed to load global rankings'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads rankings by level
   */
  loadRankingsByLevel(level: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.getRankingsByLevel(level).pipe(takeUntilDestroyed()).subscribe({
      next: (rankings: Ranking[]) => { // Added type annotation
        this.levelRankingsSignal.set(rankings);
        this.loadingSignal.set(false);
      },
      error: (err: any) => { // Added type annotation
        this.errorSignal.set(this.formatError(err, 'Failed to load level rankings'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads rankings by country
   */
  loadRankingsByCountry(country: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.getRankingsByCountry(country).pipe(takeUntilDestroyed()).subscribe({
      next: (rankings: Ranking[]) => { // Added type annotation
        this.countryRankingsSignal.set(rankings);
        this.loadingSignal.set(false);
      },
      error: (err: any) => { // Added type annotation
        this.errorSignal.set(this.formatError(err, 'Failed to load country rankings'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads user ranking
   */
  loadUserRanking(userId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rankingApi.getUserRanking(userId).pipe(takeUntilDestroyed()).subscribe({
      next: (ranking: Ranking) => { // Added type annotation
        this.userRankingSignal.set(ranking);
        this.loadingSignal.set(false);
      },
      error: (err: any) => { // Added type annotation
        this.errorSignal.set(this.formatError(err, 'Failed to load user ranking'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Gets user position in global ranking
   */
  getUserGlobalPosition(userId: number): number {
    const ranking = this.globalRankings().find(r => r.userId === userId);
    return ranking ? ranking.rankPosition : -1;
  }

  /**
   * Formats error messages for user-friendly display.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
