import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RankingStore } from '../../../application/ranking-store';
import { Leaderboard } from '../../../domain/model/leaderboard.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-leaderboard-details',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './leaderboard-details.component.html',
  styleUrls: ['./leaderboard-details.component.css']
})
export class LeaderboardDetailsComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(RankingStore);

  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true })
  });

  isEdit = false;
  leaderboardId: number | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.leaderboardId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.leaderboardId;
      if (this.isEdit) {
        const leaderboard = this.store.getLeaderboardById(this.leaderboardId)();
        if (leaderboard) {
          this.form.patchValue({
            name: leaderboard.name,
          });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const leaderboard: Leaderboard = new Leaderboard({
      id: this.leaderboardId ?? 0,
      name: this.form.value.name!,
      type: 'default-type', // Add appropriate default or get from form
      startDate: new Date(), // Add appropriate default or get from form
      endDate: new Date(), // Add appropriate default or get from form
    });

    if (this.isEdit) {
      this.store.updateLeaderboard(leaderboard);
    } else {
      this.store.addLeaderboard(leaderboard);
    }

    this.router.navigate(['ranking/leaderboards']).then();
  }
}
