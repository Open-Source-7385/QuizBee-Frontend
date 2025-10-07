import { BaseEntity } from '../../../../shared/infrastructure/base-entity';

export class Invoice extends BaseEntity {
  userId: string;
  planName: string;
  amount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paymentMethod: string;
  items?: any[];
  subtotal?: number;
  taxes?: number;
  total?: number;

  constructor(data: any) {
    super(data);
    this.userId = data.userId || '';
    this.planName = data.planName || '';
    this.amount = data.amount || 0;
    this.status = data.status || 'pending';
    this.issueDate = data.issueDate || '';
    this.dueDate = data.dueDate || '';
    this.paymentMethod = data.paymentMethod || '';
    this.items = data.items;
    this.subtotal = data.subtotal;
    this.taxes = data.taxes;
    this.total = data.total;
  }
}
