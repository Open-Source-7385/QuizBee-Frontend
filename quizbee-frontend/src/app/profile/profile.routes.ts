import { Routes } from '@angular/router';

/**
 * Profile module routes
 */
export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/components/profile-simple/profile-simple.component').then(m => m.ProfileSimpleComponent),
    title: 'QuizBee - Profile'
  }
];