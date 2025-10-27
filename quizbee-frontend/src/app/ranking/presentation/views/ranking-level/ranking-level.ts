import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RankingStore } from '../../../application/ranking-store';
import { RankingPosition } from '../../../domain/model/ranking-position';

@Component({
  selector: 'app-ranking-level',
  templateUrl: './ranking-level.html',
  styleUrls: ['./ranking-level.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RankingLevelComponent implements OnInit {
  private readonly rankingStore = inject(RankingStore);

  readonly levelRanking = this.rankingStore.levelRankingPositions;
  readonly loading = this.rankingStore.loading;
  readonly error = this.rankingStore.error;

  currentPage = 1;
  pageSize = 50;
  selectedLevel = 'A1';

  levels = [
    { value: 'A1', label: 'Beginner (A1)' },
    { value: 'A2', label: 'Elementary (A2)' },
    { value: 'B1', label: 'Intermediate (B1)' },
    { value: 'B2', label: 'Upper Intermediate (B2)' },
    { value: 'C1', label: 'Advanced (C1)' },
    { value: 'C2', label: 'Proficient (C2)' }
  ];

  ngOnInit(): void {
    this.loadLevelRanking();
  }

  onLevelChange(): void {
    this.currentPage = 1;
    this.loadLevelRanking();
  }

  loadLevelRanking(): void {
    this.rankingStore.loadRankingByLevel(this.selectedLevel, this.currentPage, this.pageSize);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadLevelRanking();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLevelRanking();
    }
  }

  trackByRanking(index: number, item: RankingPosition): number {
    return item.userId;
  }
}
