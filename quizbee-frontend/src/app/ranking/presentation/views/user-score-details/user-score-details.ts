import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RankingStore } from '../../../application/ranking-store';
import { UserScore } from '../../../domain/model/user-score.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-user-score-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './user-score-details.component.html',
  styleUrls: ['./user-score-details.component.css']
})
export class UserScoreDetailsComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(RankingStore);

  // Updated form controls to match UserScore entity structure
  form = this.fb.group({
    userId: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    totalScore: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    averageScore: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    quizzesCompleted: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0)] }),
    rank: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] })
  });

  isEdit = false;
  userScoreId: number | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.userScoreId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.userScoreId;
      if (this.isEdit) {
        const userScore = this.store.getUserScoreById(this.userScoreId)();
        if (userScore) {
          this.form.patchValue({
            userId: userScore.userId,
            totalScore: userScore.totalScore,
            averageScore: userScore.averageScore,
            quizzesCompleted: userScore.quizzesCompleted,
            rank: userScore.rank
          });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const userScore: UserScore = new UserScore({
      id: this.userScoreId ?? 0,
      userId: this.form.value.userId!,
      totalScore: this.form.value.totalScore!,
      averageScore: this.form.value.averageScore!,
      quizzesCompleted: this.form.value.quizzesCompleted!,
      rank: this.form.value.rank!
    });

    if (this.isEdit) {
      this.store.updateUserScore(userScore);
    } else {
      this.store.addUserScore(userScore);
    }

    this.router.navigate(['ranking/user-scores']).then();
  }
}
