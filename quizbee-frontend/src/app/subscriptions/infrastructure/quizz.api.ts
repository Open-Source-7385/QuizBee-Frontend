import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlanResource } from './plan.resource';
import { SubscriptionResource } from './subscription.resource';
import { InvoiceResource } from './invoice.resource';
import { Plan } from '../domain/model/plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { Invoice } from '../domain/model/invoice.entity';

@Injectable({
  providedIn: 'root'
})
export class QuizzApi {
  constructor(
    private planResource: PlanResource,
    private subscriptionResource: SubscriptionResource,
    private invoiceResource: InvoiceResource
  ) {}

  getPlans(): Observable<Plan[]> {
    return this.planResource.getAll();
  }

  getUserSubscription(userId: string): Observable<Subscription> {
    return this.subscriptionResource.getUserSubscription(userId);
  }

  cancelSubscription(userId: string): Observable<any> {
    return this.subscriptionResource.cancelSubscription(userId);
  }

  getUserInvoices(userId: string): Observable<Invoice[]> {
    return this.invoiceResource.getUserInvoices(userId);
  }

  getInvoice(id: string): Observable<Invoice> {
    return this.invoiceResource.getInvoiceById(id);
  }
}
