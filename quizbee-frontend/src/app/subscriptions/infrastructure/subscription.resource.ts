import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../../shared/infrastructure/base-api';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionAssembler } from './quizz.assembler';
import { SubscriptionResponse } from './quizz.response';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionResource extends BaseApi {
  private endpoint = 'users';

  constructor(
    http: any,
    private assembler: SubscriptionAssembler
  ) {
    super(http);
  }

  getUserSubscription(userId: string): Observable<Subscription> {
    return this.get<any>(this.getEndpoint(`${this.endpoint}/${userId}`))
      .pipe(map(response => this.assembler.toEntity(response.subscription)));
  }

  cancelSubscription(userId: string): Observable<any> {
    return this.put(this.getEndpoint(`${this.endpoint}/${userId}`), {
      subscription: { status: 'cancelled' }
    });
  }
}
