import { BaseEntity } from '../../../../shared/infrastructure/base-entity';

export class Plan extends BaseEntity {
  name: string;
  price: number;
  currency: string;
  billingPeriod: string;
  features: string[];
  popular?: boolean;

  constructor(data: any) {
    super(data);
    this.name = data.name || '';
    this.price = data.price || 0;
    this.currency = data.currency || 'USD';
    this.billingPeriod = data.billingPeriod || 'monthly';
    this.features = data.features || [];
    this.popular = data.popular || false;
  }
}
