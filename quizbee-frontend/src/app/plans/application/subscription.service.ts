import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from '../domain/model/subscription.model';
import { SubscriptionRepository } from '../infrastructure/subscription.repository';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  constructor(private subscriptionRepository: SubscriptionRepository) {}

  getUserSubscriptions(userId: string): Observable<Subscription[]> {
    return this.subscriptionRepository.getByUserId(userId);
  }

  createSubscription(subscription: Partial<Subscription>): Observable<Subscription> {
    return this.subscriptionRepository.create(subscription);
  }

  updateSubscription(id: string, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.subscriptionRepository.update(id, subscription);
  }

  cancelSubscription(id: string): Observable<void> {
    return this.subscriptionRepository.delete(id);
  }

  changePlan(subscriptionId: string, newPlanId: string): Observable<Subscription> {
    return this.subscriptionRepository.update(subscriptionId, { planId: newPlanId });
  }
}
