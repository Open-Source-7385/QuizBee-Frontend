import { Routes } from '@angular/router';

const attemptHistory = () => import('./attempt-history/attempt-history').then(m => m.AttemptHistoryComponent);
const performanceStats = () => import('./performance-stats/performance-stats').then(m => m.PerformanceStatsComponent);
const quizResults = () => import('./quiz-results/quiz-results').then(m => m.QuizResultsComponent);

export const feedbackRoutes: Routes = [
  { path: 'attempts', loadComponent: attemptHistory },
  { path: 'stats', loadComponent: performanceStats },
  { path: 'results/:attemptId', loadComponent: quizResults }
];
