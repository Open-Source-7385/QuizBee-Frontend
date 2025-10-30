// quizbee-frontend/src/app/plans/presentation/views/manage-subscription/manage-subscription.component.ts
// ✅ CON PERSISTENCIA COMPLETA EN DB.JSON

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from '../../../domain/model/subscription.model';
import { Payment } from '../../../domain/model/payment.model';
import { SubscriptionService } from '../../../application/subscription.service';
import { PaymentService } from '../../../application/payment.service';
import { AuthService } from '../../../../shared/core/auth.service';
import { UserStatsService } from '../../../../shared/core/user-stats.service';
import { environment } from '../../../../../environments/environment';
import { switchMap } from 'rxjs/operators';

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
  currentUser: any = null;

  constructor(
    private subscriptionService: SubscriptionService,
    private paymentService: PaymentService,
    private router: Router,
    private authService: AuthService,
    private userStatsService: UserStatsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      alert('Debes iniciar sesión');
      this.router.navigate(['/login']);
      return;
    }

    this.loadSubscription();
  }

  loadSubscription(): void {
    this.subscriptionService.getUserSubscriptions(this.currentUser.id).subscribe({
      next: (subscriptions) => {
        if (subscriptions.length > 0) {
          this.subscription = subscriptions[0];
          this.loadPayments();
        } else {
          console.log('No active subscription found');
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
    if (!this.subscription) return;

    // ✅ PASO 1: Actualizar suscripción a "cancelled"
    this.subscriptionService.cancelSubscription(this.subscription.id).pipe(
      switchMap(() => {
        // ✅ PASO 2: Actualizar usuario en db.json
        const userUpdateUrl = `${environment.platformProviderApiBaseUrl}/users/${this.currentUser.id}`;
        const userUpdate = {
          subscriptionStatus: 'free',
          subscriptionExpiry: null,
          stats: {
            ...this.currentUser.stats,
            lives: 5 // Volver a 5 vidas
          }
        };

        console.log('📝 Actualizando usuario a FREE:', userUpdate);
        return this.http.patch(userUpdateUrl, userUpdate);
      }),
      switchMap(() => {
        // ✅ PASO 3: Actualizar UserStatsService
        return this.userStatsService.updateSubscriptionStatus(false);
      })
    ).subscribe({
      next: () => {
        console.log('✅ Suscripción cancelada completamente');

        // ✅ Actualizar localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          ...this.currentUser,
          subscriptionStatus: 'free',
          stats: {
            ...this.currentUser.stats,
            lives: 5
          }
        }));

        this.showCancelModal = false;
        alert('Tu suscripción ha sido cancelada. Has vuelto al plan FREE con 5 vidas diarias.');

        // Recargar para reflejar cambios
        this.userStatsService.reloadFromDatabase().subscribe(() => {
          this.router.navigate(['/plans']);
        });
      },
      error: (error) => {
        console.error('❌ Error cancelling subscription:', error);
        alert('Error al cancelar la suscripción');
      }
    });
  }

  updatePaymentMethod(): void {
    alert('Funcionalidad de actualización de método de pago próximamente');
  }

  viewInvoiceHistory(): void {
    this.router.navigate(['/invoice-history']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  get userName(): string {
    return this.currentUser?.name || this.currentUser?.displayName || 'Usuario';
  }

  get userAvatar(): string {
    return this.currentUser?.avatar || '👤';
  }

  get userStatus(): string {
    return this.subscription?.status === 'active' ? 'Premium' : 'Free';
  }
}
