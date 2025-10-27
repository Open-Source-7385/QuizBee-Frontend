import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackStore } from '../../../application/feedback-store';
import { Feedback } from '../../../domain/model/feedback.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card'; // ADD THIS IMPORT

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSliderModule,
    MatCardModule
  ],
  templateUrl: './feedback-form.html',
  styleUrl: './feedback-form.css'
})
export class FeedbackForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(FeedbackStore);

  form = this.fb.group({
    quizId: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    userId: new FormControl<number>(1, { // Add userId field
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    rating: new FormControl<number>(3, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(5)]
    }),
    comment: new FormControl<string>('', { nonNullable: true })
  });

  isEdit = false;
  feedbackId: number | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.feedbackId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.feedbackId;
      if (this.isEdit) {
        const feedback = this.store.feedbacks().find(f => f.id === this.feedbackId);
        if (feedback) {
          this.form.patchValue({
            quizId: feedback.quizId,
            userId: feedback.userId, // Populate userId
            rating: feedback.rating,
            comment: feedback.comment || ''
          });
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const feedback: Feedback = new Feedback({
      id: this.feedbackId ?? 0,
      quizId: this.form.value.quizId!,
      userId: this.form.value.userId!, // Include userId
      rating: this.form.value.rating!,
      comment: this.form.value.comment!,
      createdAt: new Date() // Always provide a date
    });

    if (this.isEdit) {
      this.store.updateFeedback(feedback);
    } else {
      this.store.addFeedback(feedback);
    }

    this.router.navigate(['learning/feedback']).then();
  }
}
