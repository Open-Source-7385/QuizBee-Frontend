import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizzApi } from '../../../infrastructure/quizz.api';
import { Invoice } from '../../../domain/model/invoice.entity';

@Component({
  selector: 'app-invoice-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.css']
})
export class InvoiceHistoryComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = true;
  userId = '1';
  searchQuery = '';

  constructor(
    private quizzApi: QuizzApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.quizzApi.getUserInvoices(this.userId).subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invoices:', error);
        this.loading = false;
      }
    });
  }

  viewInvoice(invoice: Invoice): void {
    this.router.navigate(['/invoice-detail', invoice.id]);
  }

  downloadPDF(invoice: Invoice): void {
    alert(`Descargando factura ${invoice.id}`);
  }

  backToAdmin(): void {
    this.router.navigate(['/subscription-admin']);
  }
}
