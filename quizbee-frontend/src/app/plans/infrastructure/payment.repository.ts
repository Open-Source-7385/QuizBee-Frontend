import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../domain/model/payment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentRepository {
  private apiUrl = `${environment.platformProviderApiBaseUrl}/payments`;

  constructor(private http: HttpClient) {}

  create(payment: Partial<Payment>): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  getBySubscriptionId(subscriptionId: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}?subscriptionId=${subscriptionId}`);
  }
}
