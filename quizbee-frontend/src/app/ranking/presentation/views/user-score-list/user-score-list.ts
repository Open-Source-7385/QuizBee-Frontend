import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RankingStore } from '../../../application/ranking-store';

@Component({
  selector: 'app-user-score-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatError, MatProgressSpinner],
  templateUrl: './user-score-list.component.html',
  styleUrls: ['./user-score-list.component.css']
})
export class UserScoreListComponent {
  readonly store = inject(RankingStore);
  private router = inject(Router);

  displayedColumns: string[] = ['id', 'userId', 'score', 'completedAt', 'actions'];

  editUserScore(id: number) {
    this.router.navigate(['ranking/user-scores/edit', id]).then();
  }

  deleteUserScore(id: number) {
    this.store.deleteUserScore(id);
  }
}
