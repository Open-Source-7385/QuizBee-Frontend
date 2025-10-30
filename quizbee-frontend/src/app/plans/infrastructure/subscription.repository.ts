import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from '../domain/model/subscription.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionRepository {
  private apiUrl = `${environment.platformProviderApiBaseUrl}/subscriptions`;

  constructor(private http: HttpClient) {}

  getByUserId(userId: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrl}?userId=${userId}`);
  }

  create(subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.post<Subscription>(this.apiUrl, subscription);
  }

  update(id: string, subscription: Partial<Subscription>): Observable<Subscription> {
    return this.http.patch<Subscription>(`${this.apiUrl}/${id}`, subscription);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
