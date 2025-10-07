import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { Plan } from '../domain/model/plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { Invoice } from '../domain/model/invoice.entity';
import { PlanResponse, SubscriptionResponse, InvoiceResponse } from './quizz.response';

@Injectable({
  providedIn: 'root'
})
export class PlanAssembler extends BaseAssembler<Plan, PlanResponse> {
  toEntity(response: PlanResponse): Plan {
    return new Plan(response);
  }

  toResponse(entity: Plan): PlanResponse {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      currency: entity.currency,
      billingPeriod: entity.billingPeriod,
      features: entity.features,
      popular: entity.popular
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionAssembler extends BaseAssembler<Subscription, SubscriptionResponse> {
  toEntity(response: SubscriptionResponse): Subscription {
    return new Subscription(response);
  }

  toResponse(entity: Subscription): SubscriptionResponse {
    return {
      id: entity.id,
      planId: entity.planId,
      planName: entity.planName,
      status: entity.status,
      startDate: entity.startDate,
      nextBillingDate: entity.nextBillingDate,
      price: entity.price,
      benefits: entity.benefits
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceAssembler extends BaseAssembler<Invoice, InvoiceResponse> {
  toEntity(response: InvoiceResponse): Invoice {
    return new Invoice(response);
  }

  toResponse(entity: Invoice): InvoiceResponse {
    return {
      id: entity.id,
      userId: entity.userId,
      planName: entity.planName,
      amount: entity.amount,
      status: entity.status,
      issueDate: entity.issueDate,
      dueDate: entity.dueDate,
      paymentMethod: entity.paymentMethod,
      items: entity.items,
      subtotal: entity.subtotal,
      taxes: entity.taxes,
      total: entity.total
    };
  }
}
