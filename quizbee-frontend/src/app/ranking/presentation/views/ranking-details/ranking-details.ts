import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RankingStore } from '../../../application/ranking-store';
import { Ranking } from '../../../domain/model/ranking.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ranking-details',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './ranking-details.component.html',
  styleUrls: ['./ranking-details.component.css']
})
export class RankingDetailsComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(RankingStore);

  // Update form controls to match Ranking entity structure
  form = this.fb.group({
    userId: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    quizId: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    score: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    timeSpent: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    completedAt: new FormControl<string | Date>(new Date(), { nonNullable: true, validators: [Validators.required] })
  });

  isEdit = false;
  rankingId: number | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.rankingId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.rankingId;
      if (this.isEdit) {
        const ranking = this.store.getRankingById(this.rankingId)();
        if (ranking) {
          this.form.patchValue({
            userId: ranking.userId,
            quizId: ranking.quizId,
            score: ranking.score,
            timeSpent: ranking.timeSpent,
            completedAt: ranking.completedAt
          });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const ranking: Ranking = new Ranking({
      id: this.rankingId ?? 0,
      userId: this.form.value.userId!,
      quizId: this.form.value.quizId!,
      score: this.form.value.score!,
      timeSpent: this.form.value.timeSpent!,
      completedAt: this.form.value.completedAt!
    });

    if (this.isEdit) {
      this.store.updateRanking(ranking);
    } else {
      this.store.addRanking(ranking);
    }

    this.router.navigate(['ranking/rankings']).then();
  }
}
