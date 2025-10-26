// src/app/feedback/presentation/views/feedback.routes.ts
import {Routes} from '@angular/router';

const feedbackList = () => import('./feedback-list/feedback-list').then(m => m.FeedbackList);
const feedbackForm = () => import('./feedback-form/feedback-form').then(m => m.FeedbackForm);
const feedbackResponseList = () => import('./feedback-response-list/feedback-response-list').then(m => m.FeedbackResponseList);
const feedbackResponseForm = () => import('./feedback-response-form/feedback-response-form').then(m => m.FeedbackResponseForm);

export const feedbackRoutes: Routes = [
  { path: '', loadComponent: feedbackList },
  { path: 'new', loadComponent: feedbackForm },
  { path: 'edit/:id', loadComponent: feedbackForm },
  { path: ':id/responses', loadComponent: feedbackResponseList },
  { path: ':id/responses/new', loadComponent: feedbackResponseForm }
];
