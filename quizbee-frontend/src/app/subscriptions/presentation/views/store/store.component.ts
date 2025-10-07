import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface LifePackage {
  id: string;
  name: string;
  price: number;
  quantity: number;
  icon: string;
}

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit {
  packages: LifePackage[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPackages();
  }

  loadPackages(): void {
    this.http.get<LifePackage[]>(`${environment.apiUrl}/lifePackages`).subscribe({
      next: (packages) => {
        this.packages = packages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading packages:', error);
        this.loading = false;
      }
    });
  }

  buyPackage(pkg: LifePackage): void {
    alert(`Comprando: ${pkg.name} por ${pkg.price}`);
  }
}
