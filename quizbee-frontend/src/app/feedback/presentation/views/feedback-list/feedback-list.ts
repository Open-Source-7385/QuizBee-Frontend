import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackStore } from '../../../application/feedback-store';
import { Feedback } from '../../../domain/model/feedback.entity';

@Component({
  selector: 'app-feedback-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatError,
    MatProgressSpinner,
    MatIconModule
  ],
  templateUrl: './feedback-list.html',
  styleUrl: './feedback-list.css'
})
export class FeedbackList {
  readonly store = inject(FeedbackStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'quizId', 'rating', 'comment', 'actions'];

  editFeedback(id: number) {
    this.router.navigate(['learning/feedback/edit', id]).then();
  }

  deleteFeedback(id: number) {
    this.store.deleteFeedback(id);
  }

  viewResponses(feedbackId: number) {
    this.router.navigate(['learning/feedback', feedbackId, 'responses']).then();
  }
}
