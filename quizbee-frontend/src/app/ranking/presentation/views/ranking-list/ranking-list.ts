import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RankingStore } from '../../../application/ranking-store';

@Component({
  selector: 'app-ranking-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatError, MatProgressSpinner],
  templateUrl: './ranking-list.component.html',
  styleUrls: ['./ranking-list.component.css']
})
export class RankingListComponent {
  readonly store = inject(RankingStore);
  private router = inject(Router);

  displayedColumns: string[] = ['id', 'name', 'score', 'position', 'actions'];

  editRanking(id: number) {
    this.router.navigate(['ranking/rankings/edit', id]).then();
  }

  deleteRanking(id: number) {
    this.store.deleteRanking(id);
  }
}
