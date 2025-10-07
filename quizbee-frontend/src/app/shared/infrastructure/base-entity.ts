export class BaseEntity {
  id: string;

  constructor(data: any) {
    this.id = data.id || '';
  }
}
