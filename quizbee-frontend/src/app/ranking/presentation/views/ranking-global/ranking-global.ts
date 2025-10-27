import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingStore } from '../../../application/ranking-store';
import { RankingPosition } from '../../../domain/model/ranking-position';

@Component({
  selector: 'app-ranking-global',
  templateUrl: './ranking-global.html',
  styleUrls: ['./ranking-global.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RankingGlobalComponent implements OnInit {
  private readonly rankingStore = inject(RankingStore);

  readonly globalRanking = this.rankingStore.globalRankingPositions;
  readonly loading = this.rankingStore.loading;
  readonly error = this.rankingStore.error;

  currentPage = 1;
  pageSize = 50;

  ngOnInit(): void {
    this.loadGlobalRanking();
  }

  loadGlobalRanking(): void {
    this.rankingStore.loadGlobalRanking(this.currentPage, this.pageSize);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadGlobalRanking();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGlobalRanking();
    }
  }

  trackByRanking(index: number, item: RankingPosition): number {
    return item.userId;
  }
}
