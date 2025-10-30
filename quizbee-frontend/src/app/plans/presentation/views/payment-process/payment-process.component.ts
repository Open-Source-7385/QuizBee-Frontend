// quizbee-frontend/src/app/plans/presentation/views/payment-process/payment-process.component.ts
// ✅ CON PERSISTENCIA COMPLETA EN DB.JSON

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Plan } from '../../../domain/model/plan.model';
import { PaymentService } from '../../../application/payment.service';
import { SubscriptionService } from '../../../application/subscription.service';
import { PaymentRequest } from '../../../domain/model/payment.model';
import { AuthService } from '../../../../shared/core/auth.service';
import { UserStatsService } from '../../../../shared/core/user-stats.service';
import { environment } from '../../../../../environments/environment';
import { switchMap } from 'rxjs/operators';

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
  currentUser: any = null;

  formData = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    ownerName: ''
  };

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private userStatsService: UserStatsService,
    private http: HttpClient
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.plan = navigation?.extras?.state?.['plan'] || null;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      alert('Debes iniciar sesión para comprar un plan');
      this.router.navigate(['/login']);
      return;
    }

    this.formData.ownerName = this.currentUser.name || this.currentUser.displayName || '';

    if (!this.plan) {
      this.router.navigate(['/plans']);
    }
  }

  selectPaymentMethod(method: 'card' | 'paypal'): void {
    this.paymentMethod = method;
  }

  onSubmit(): void {
    if (!this.plan || !this.currentUser) return;

    this.processing = true;

    // Simular procesamiento de pago
    setTimeout(() => {
      this.processPaymentAndSubscription();
    }, 2000);
  }

  private processPaymentAndSubscription(): void {
    const subscriptionData = {
      userId: this.currentUser.id,
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
      benefits: this.plan!.features || [
        'Vidas ilimitadas',
        'Acceso completo',
        'Estadísticas avanzadas'
      ]
    };

    // ✅ PASO 1: Crear suscripción en la tabla "subscriptions"
    this.subscriptionService.createSubscription(subscriptionData).pipe(
      switchMap(createdSub => {
        console.log('✅ Suscripción creada:', createdSub);

        // ✅ PASO 2: Actualizar usuario con subscriptionStatus = "active"
        const userUpdateUrl = `${environment.platformProviderApiBaseUrl}/users/${this.currentUser.id}`;
        const userUpdate = {
          subscriptionStatus: 'active',
          subscriptionExpiry: subscriptionData.nextBillingDate,
          stats: {
            ...this.currentUser.stats,
            lives: 999999 // Vidas ilimitadas
          }
        };

        return this.http.patch(userUpdateUrl, userUpdate);
      }),
      switchMap(() => {
        // ✅ PASO 3: Actualizar UserStatsService
        return this.userStatsService.updateSubscriptionStatus(true);
      })
    ).subscribe({
      next: () => {
        this.processing = false;

        console.log('✅ TODO ACTUALIZADO:');
        console.log('  - Suscripción creada en /subscriptions');
        console.log('  - Usuario actualizado en /users');
        console.log('  - UserStatsService actualizado');

        alert(`🎉 ¡Felicidades ${this.currentUser.name}! Ahora eres usuario Premium con vidas ilimitadas ∞`);

        // ✅ Recargar datos del usuario en AuthService
        this.authService.currentUser$.subscribe(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify({
              ...user,
              subscriptionStatus: 'active',
              stats: {
                ...user.stats,
                lives: 999999
              }
            }));
          }
        });

        this.router.navigate(['/manage-subscription']);
      },
      error: (error) => {
        console.error('❌ Error en el proceso:', error);
        this.processing = false;
        alert('Error al procesar el pago. Intenta nuevamente.');
      }
    });
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

  get userName(): string {
    return this.currentUser?.name || this.currentUser?.displayName || 'Usuario';
  }
}
