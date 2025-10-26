import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FeedbackStore } from '../../../application/feedback-store';
import { FeedbackResponse } from '../../../domain/model/feedback-response.entity';

@Component({
  selector: 'app-feedback-response-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatError,
    MatProgressSpinner,
    MatCardModule
  ],
  templateUrl: './feedback-response-list.component.html',
  styleUrl: './feedback-response-list.component.css'
})
export class FeedbackResponseList implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly store = inject(FeedbackStore);

  feedbackId!: number;
  displayedColumns: string[] = ['id', 'response', 'actions'];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.feedbackId = +params['id'];
      this.store.loadFeedbackResponses(this.feedbackId);
    });
  }

  addResponse() {
    this.router.navigate(['learning/feedback', this.feedbackId, 'responses', 'new']).then();
  }

  deleteResponse(id: number) {
    // Note: You might need to add a delete method to FeedbackStore
    // this.store.deleteFeedbackResponse(id);
  }

  goBack() {
    this.router.navigate(['learning/feedback']).then();
  }
}
