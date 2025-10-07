import { BaseResponse } from '../../../shared/infrastructure/base-response';

export interface PlanResponse {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  popular?: boolean;
}

export interface SubscriptionResponse {
  id: string;
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  nextBillingDate: string;
  price: number;
  benefits: string[];
}

export interface InvoiceResponse {
  id: string;
  userId: string;
  planName: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
  items?: any[];
  subtotal?: number;
  taxes?: number;
  total?: number;
}
