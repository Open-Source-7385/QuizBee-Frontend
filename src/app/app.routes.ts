import { Routes } from '@angular/router';
import { PlanSelectionComponent } from './plans/presentation/views/plan-selection/plan-selection.component';
import { PaymentProcessComponent } from './plans/presentation/views/payment-process/payment-process.component';
import { ManageSubscriptionComponent } from './plans/presentation/views/manage-subscription/manage-subscription.component';
import { InvoiceHistoryComponent } from './plans/presentation/views/invoice-history/invoice-history.component';
import { InvoiceDetailComponent } from './plans/presentation/views/invoice-detail/invoice-detail.component';

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
    path: 'invoice-history',
    component: InvoiceHistoryComponent
  },
  {
    path: 'invoice-detail/:id',
    component: InvoiceDetailComponent
  },
  {
    path: '**',
    redirectTo: '/plans'
  }
];
