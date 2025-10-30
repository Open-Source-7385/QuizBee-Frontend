export interface PaymentRequest {
  planId: string;
  userId: string;
  paymentMethod: 'card' | 'paypal';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  ownerName?: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  paymentMethod: string;
  lastFourDigits: string;
}
