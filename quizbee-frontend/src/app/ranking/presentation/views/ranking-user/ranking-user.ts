import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingStore } from '../../../application/ranking-store';
import { RankingPosition } from '../../../domain/model/ranking-position';
import { RouterLink } from '@angular/router'; // Add this import


@Component({
  selector: 'app-ranking-user',
  templateUrl: './ranking-user.html',
  styleUrls: ['./ranking-user.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class RankingUserComponent implements OnInit {
  private readonly rankingStore = inject(RankingStore);

  readonly userRanking = this.rankingStore.userRanking;
  readonly userPosition = this.rankingStore.userPosition;
  readonly globalRanking = this.rankingStore.globalRankingPositions;
  readonly loading = this.rankingStore.loading;
  readonly error = this.rankingStore.error;

  // In a real app, this would come from authentication service
  currentUserId = 1; // Mock user ID

  ngOnInit(): void {
    this.loadUserRanking();
  }

  loadUserRanking(): void {
    this.rankingStore.loadUserRanking(this.currentUserId);
    this.rankingStore.loadGlobalRanking(1, 10); // Load top 10 for context
  }

  getRankBadge(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return 'rank-other';
  }

  trackByRanking(index: number, item: RankingPosition): number {
    return item.userId;
  }
}
