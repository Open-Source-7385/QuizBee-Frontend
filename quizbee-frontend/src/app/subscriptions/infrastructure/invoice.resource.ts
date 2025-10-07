import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../../shared/infrastructure/base-api';
import { Invoice } from '../domain/model/invoice.entity';
import { InvoiceAssembler } from './quizz.assembler';
import { InvoiceResponse } from './quizz.response';

@Injectable({
  providedIn: 'root'
})
export class InvoiceResource extends BaseApi {
  private endpoint = 'invoices';

  constructor(
    http: any,
    private assembler: InvoiceAssembler
  ) {
    super(http);
  }

  getUserInvoices(userId: string): Observable<Invoice[]> {
    return this.get<InvoiceResponse[]>(this.getEndpoint(`${this.endpoint}?userId=${userId}`))
      .pipe(map(responses => this.assembler.toEntityList(responses)));
  }

  getInvoiceById(id: string): Observable<Invoice> {
    return this.get<InvoiceResponse>(this.getEndpoint(`${this.endpoint}/${id}`))
      .pipe(map(response => this.assembler.toEntity(response)));
  }
}
