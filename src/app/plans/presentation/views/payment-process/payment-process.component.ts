import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Plan } from '../../../domain/model/plan.model';
import { PaymentService } from '../../../application/payment.service';
import { SubscriptionService } from '../../../application/subscription.service';
import { PaymentRequest } from '../../../domain/model/payment.model';

@Component({
  selector: 'app-payment-process',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css']
})
export class PaymentProcessComponent implements OnInit {
  plan: Plan | null = null;
  paymentMethod: 'card' | 'paypal' = 'card';
  processing = false;

  formData = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    ownerName: 'Pedro Castillo'
  };

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.plan = navigation?.extras?.state?.['plan'] || null;
  }

  ngOnInit(): void {
    if (!this.plan) {
      this.router.navigate(['/plans']);
    }
  }

  selectPaymentMethod(method: 'card' | 'paypal'): void {
    this.paymentMethod = method;
  }

  onSubmit(): void {
    if (!this.plan) return;

    this.processing = true;

    const paymentRequest: PaymentRequest = {
      planId: this.plan.id,
      userId: 'pedro-castillo',
      paymentMethod: this.paymentMethod,
      cardNumber: this.formData.cardNumber,
      expiryDate: this.formData.expiryDate,
      cvv: this.formData.cvv,
      ownerName: this.formData.ownerName
    };

    // Simular procesamiento de pago
    setTimeout(() => {
      const subscription = {
        userId: 'pedro-castillo',
        planId: this.plan!.id,
        planName: this.plan!.name,
        price: this.plan!.price,
        status: 'active' as const,
        startDate: new Date().toISOString(),
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: {
          type: this.paymentMethod === 'card' ? 'visa' : 'paypal',
          lastFourDigits: this.formData.cardNumber.slice(-4),
          expiryDate: this.formData.expiryDate
        },
        benefits: [
          '1 cuenta Premium verificada',
          'Múltiples Beneficios',
          'Cancela cuando quieras'
        ]
      };

      this.subscriptionService.createSubscription(subscription).subscribe({
        next: () => {
          this.processing = false;
          this.router.navigate(['/manage-subscription']);
        },
        error: (error) => {
          console.error('Error creating subscription:', error);
          this.processing = false;
        }
      });
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/plans']);
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.formData.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.formData.expiryDate = value;
  }
}
