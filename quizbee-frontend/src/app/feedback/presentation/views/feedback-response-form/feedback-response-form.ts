import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FeedbackStore } from '../../../application/feedback-store';
import { FeedbackResponse } from '../../../domain/model/feedback-response.entity';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-feedback-response-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './feedback-response-form.html',
  styleUrl: './feedback-response-form.css'
})
export class FeedbackResponseForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(FeedbackStore);

  form = this.fb.group({
    creatorId: new FormControl<number>(1, { // Add creatorId field
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    response: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  feedbackId!: number;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.feedbackId = +params['id'];
    });
  }

  submit() {
    if (this.form.invalid) return;

    const response: FeedbackResponse = new FeedbackResponse({
      id: 0, // Will be set by the API
      feedbackId: this.feedbackId,
      creatorId: this.form.value.creatorId!, // Include creatorId
      response: this.form.value.response!,
      createdAt: new Date()
    });

    this.store.addFeedbackResponse(response);
    this.router.navigate(['learning/feedback', this.feedbackId, 'responses']).then();
  }

  cancel() {
    this.router.navigate(['learning/feedback', this.feedbackId, 'responses']).then();
  }
}
