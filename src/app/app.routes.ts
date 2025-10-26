import { Routes } from '@angular/router';
import { PlanSelectionComponent } from './plans/presentation/views/plan-selection/plan-selection.component';
import { PaymentProcessComponent } from './plans/presentation/views/payment-process/payment-process.component';
import { ManageSubscriptionComponent } from './plans/presentation/views/manage-subscription/manage-subscription.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/plans',
    pathMatch: 'full'
  },
  {
    path: 'plans',
    component: PlanSelectionComponent
  },
  {
    path: 'payment',
    component: PaymentProcessComponent
  },
  {
    path: 'manage-subscription',
    component: ManageSubscriptionComponent
  },
  {
    path: '**',
    redirectTo: '/plans'
  }
];
