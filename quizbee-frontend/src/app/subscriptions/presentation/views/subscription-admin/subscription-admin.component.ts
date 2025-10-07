import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizzApi } from '../../../infrastructure/quizz.api';
import { Subscription } from '../../../domain/model/subscription.entity';

@Component({
  selector: 'app-subscription-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-admin.component.html',
  styleUrls: ['./subscription-admin.component.css']
})
export class SubscriptionAdminComponent implements OnInit {
  subscription: Subscription | null = null;
  loading = true;
  userId = '1';

  constructor(
    private quizzApi: QuizzApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubscription();
  }

  loadSubscription(): void {
    this.quizzApi.getUserSubscription(this.userId).subscribe({
      next: (subscription) => {
        this.subscription = subscription;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading subscription:', error);
        this.loading = false;
      }
    });
  }

  changePlan(): void {
    this.router.navigate(['/pricing']);
  }

  cancelSubscription(): void {
    if (confirm('¿Estás seguro de que deseas cancelar tu suscripción?')) {
      this.quizzApi.cancelSubscription(this.userId).subscribe({
        next: () => {
          alert('Suscripción cancelada exitosamente');
          this.loadSubscription();
        },
        error: (error) => {
          console.error('Error cancelling subscription:', error);
          alert('Error al cancelar la suscripción');
        }
      });
    }
  }

  viewInvoices(): void {
    this.router.navigate(['/invoice-history']);
  }
}
