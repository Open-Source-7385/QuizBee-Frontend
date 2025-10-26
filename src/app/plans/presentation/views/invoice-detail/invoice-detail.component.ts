import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

interface InvoiceDetail {
  invoiceNumber: string;
  date: string;
  status: string;
  billedTo: {
    name: string;
    email: string;
  };
  description: string;
  amount: number;
  paymentMethod: string;
  cardLastDigits: string;
  plan: string;
  subtotal: number;
  taxes: number;
  total: number;
}

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  invoice: InvoiceDetail | null = null;
  loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.paramMap.get('id');
    this.loadInvoiceDetail(invoiceId);
  }

  loadInvoiceDetail(invoiceId: string | null): void {
    // Simulación de carga de factura
    setTimeout(() => {
      this.invoice = {
        invoiceNumber: 'INV-2025-010',
        date: '05 Oct 2025',
        status: 'Pagada',
        billedTo: {
          name: 'Pedro Castillo',
          email: 'pedro.castillo@example.com'
        },
        description: 'Suscripción Super Familia - Octubre 2025',
        amount: 10.69,
        paymentMethod: 'Visa',
        cardLastDigits: '1467',
        plan: 'Super Familia',
        subtotal: 10.69,
        taxes: 0.00,
        total: 10.69
      };
      this.loading = false;
    }, 500);
  }

  downloadPDF(): void {
    alert('Descargando factura en PDF...');
  }

  goBack(): void {
    this.router.navigate(['/invoice-history']);
  }
}
