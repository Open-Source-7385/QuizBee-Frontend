import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from '../../../domain/model/subscription.model';
import { Payment } from '../../../domain/model/payment.model';
import { SubscriptionService } from '../../../application/subscription.service';
import { PaymentService } from '../../../application/payment.service';

@Component({
  selector: 'app-manage-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manage-subscription.component.html',
  styleUrls: ['./manage-subscription.component.css']
})
export class ManageSubscriptionComponent implements OnInit {
  subscription: Subscription | null = null;
  payments: Payment[] = [];
  loading = true;
  showCancelModal = false;
  userId = 'pedro-castillo';

  constructor(
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubscription();
  }

  loadSubscription(): void {
    this.subscriptionService.getUserSubscriptions(this.userId).subscribe({
      next: (subscriptions) => {
        if (subscriptions.length > 0) {
          this.subscription = subscriptions[0];
          this.loadPayments();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading subscription:', error);
        this.loading = false;
      }
    });
  }

  loadPayments(): void {
    if (this.subscription) {
      this.paymentService.getPaymentHistory(this.subscription.id).subscribe({
        next: (payments) => {
          this.payments = payments;
        },
        error: (error) => {
          console.error('Error loading payments:', error);
        }
      });
    }
  }

  changePlan(): void {
    this.router.navigate(['/plans']);
  }

  openCancelModal(): void {
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
  }

  confirmCancel(): void {
    if (this.subscription) {
      this.subscriptionService.cancelSubscription(this.subscription.id).subscribe({
        next: () => {
          alert('Tu suscripción ha sido cancelada');
          this.showCancelModal = false;
          this.router.navigate(['/plans']);
        },
        error: (error) => {
          console.error('Error cancelling subscription:', error);
          alert('Error al cancelar la suscripción');
        }
      });
    }
  }

  updatePaymentMethod(): void {
    alert('Funcionalidad de actualización de método de pago próximamente');
  }

  viewInvoiceHistory(): void {
    alert('Mostrando historial de facturas');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
