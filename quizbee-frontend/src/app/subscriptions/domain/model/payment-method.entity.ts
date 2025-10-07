import { BaseEntity } from '../../../../shared/infrastructure/base-entity';

export class PaymentMethod extends BaseEntity {
  userId: string;
  type: string;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;

  constructor(data: any) {
    super(data);
    this.userId = data.userId || '';
    this.type = data.type || '';
    this.lastFour = data.lastFour || '';
    this.expiryDate = data.expiryDate || '';
    this.isDefault = data.isDefault || false;
  }
}
