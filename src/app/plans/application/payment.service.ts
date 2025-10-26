import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Payment, PaymentRequest } from '../domain/model/payment.model';
import { PaymentRepository } from '../infrastructure/payment.repository';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private paymentRepository: PaymentRepository) {}

  processPayment(paymentRequest: PaymentRequest): Observable<Payment> {
    // Simulación de procesamiento de pago
    const payment: Partial<Payment> = {
      subscriptionId: '', // Se asignará después de crear la suscripción
      amount: 0, // Se calculará según el plan
      currency: '$',
      status: 'completed',
      date: new Date().toISOString(),
      paymentMethod: paymentRequest.paymentMethod === 'card' ? 'visa' : 'paypal',
      lastFourDigits: paymentRequest.cardNumber?.slice(-4) || '0000'
    };

    return this.paymentRepository.create(payment);
  }

  getPaymentHistory(subscriptionId: string): Observable<Payment[]> {
    return this.paymentRepository.getBySubscriptionId(subscriptionId);
  }
}
