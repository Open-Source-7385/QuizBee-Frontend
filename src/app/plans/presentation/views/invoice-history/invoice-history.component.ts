import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Payment } from '../../../domain/model/payment.model';
import { PaymentService } from '../../../application/payment.service';
import { SubscriptionService } from '../../../application/subscription.service';

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  plan: string;
  amount: number;
  status: 'Pagada' | 'Pendiente' | 'Cancelada';
}

@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  searchTerm: string = '';
  loading = true;
  userId = 'pedro-castillo';

  constructor(
    private paymentService: PaymentService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.subscriptionService.getUserSubscriptions(this.userId).subscribe({
      next: (subscriptions) => {
        if (subscriptions.length > 0) {
          const subscription = subscriptions[0];

          // Generar facturas de ejemplo basadas en la suscripción
          this.invoices = [
            {
              id: '1',
              invoiceNumber: 'INV-2025-010',
              date: '03 Oct 2025',
              plan: subscription.planName,
              amount: subscription.price,
              status: 'Pagada'
            },
            {
              id: '2',
              invoiceNumber: 'INV-2025-009',
              date: '03 Sep 2025',
              plan: subscription.planName,
              amount: subscription.price,
              status: 'Pagada'
            },
            {
              id: '3',
              invoiceNumber: 'INV-2025-008',
              date: '03 Aug 2025',
              plan: subscription.planName,
              amount: subscription.price,
              status: 'Pagada'
            }
          ];

          this.filteredInvoices = [...this.invoices];
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredInvoices = [...this.invoices];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredInvoices = this.invoices.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(term) ||
      invoice.plan.toLowerCase().includes(term)
    );
  }

  viewInvoice(invoice: Invoice): void {
    alert(`Ver factura: ${invoice.invoiceNumber}`);
  }

  downloadInvoice(invoice: Invoice): void {
    alert(`Descargar factura: ${invoice.invoiceNumber}`);
  }

  goBack(): void {
    this.router.navigate(['/manage-subscription']);
  }
}
