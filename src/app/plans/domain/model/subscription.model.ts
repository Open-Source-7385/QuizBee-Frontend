export interface PaymentMethod {
  type: string;
  lastFourDigits: string;
  expiryDate: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  price: number;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  nextBillingDate: string;
  paymentMethod: PaymentMethod;
  benefits: string[];
}
