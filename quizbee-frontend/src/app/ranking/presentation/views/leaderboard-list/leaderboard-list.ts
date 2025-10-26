import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RankingStore } from '../../../application/ranking-store';

@Component({
  selector: 'app-leaderboard-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatError, MatProgressSpinner],
  templateUrl: './leaderboard-list.component.html',
  styleUrls: ['./leaderboard-list.component.css']
})
export class LeaderboardListComponent {
  readonly store = inject(RankingStore);
  private router = inject(Router);

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  editLeaderboard(id: number) {
    this.router.navigate(['ranking/leaderboards/edit', id]).then();
  }

  deleteLeaderboard(id: number) {
    this.store.deleteLeaderboard(id);
  }
}
