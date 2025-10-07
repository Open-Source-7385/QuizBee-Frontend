import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Plan } from '../../../domain/model/plan.entity';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  plan: Plan | null = null;
  paymentMethod: string = 'tarjeta';

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardHolder: string = '';

  subtotal: number = 0;
  taxes: number = 0;
  total: number = 0;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.plan = navigation.extras.state['plan'];
    }
  }

  ngOnInit(): void {
    if (this.plan) {
      this.calculateTotal();
    } else {
      this.router.navigate(['/pricing']);
    }
  }

  calculateTotal(): void {
    if (this.plan) {
      this.subtotal = this.plan.price;
      this.taxes = Math.round(this.subtotal * 0.0688 * 100) / 100;
      this.total = Math.round((this.subtotal + this.taxes) * 100) / 100;
    }
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
  }

  confirmPayment(): void {
    if (this.validateForm()) {
      alert('Pago procesado exitosamente');
      this.router.navigate(['/subscription-admin']);
    }
  }

  validateForm(): boolean {
    if (this.paymentMethod === 'tarjeta') {
      return this.cardNumber.length > 0 &&
             this.expiryDate.length > 0 &&
             this.cvv.length > 0 &&
             this.cardHolder.length > 0;
    }
    return true;
  }
}
