import { BaseEntity } from '../../../../shared/infrastructure/base-entity';

export class Subscription extends BaseEntity {
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  nextBillingDate: string;
  price: number;
  benefits: string[];

  constructor(data: any) {
    super(data);
    this.planId = data.planId || '';
    this.planName = data.planName || '';
    this.status = data.status || 'inactive';
    this.startDate = data.startDate || '';
    this.nextBillingDate = data.nextBillingDate || '';
    this.price = data.price || 0;
    this.benefits = data.benefits || [];
  }
}
