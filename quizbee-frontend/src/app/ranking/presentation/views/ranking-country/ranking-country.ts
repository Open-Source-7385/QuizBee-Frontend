import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RankingStore } from '../../../application/ranking-store';
import { RankingPosition } from '../../../domain/model/ranking-position';

@Component({
  selector: 'app-ranking-country',
  templateUrl: './ranking-country.html',
  styleUrls: ['./ranking-country.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RankingCountryComponent implements OnInit {
  private readonly rankingStore = inject(RankingStore);

  readonly countryRanking = this.rankingStore.countryRankingPositions;
  readonly loading = this.rankingStore.loading;
  readonly error = this.rankingStore.error;

  currentPage = 1;
  pageSize = 50;
  selectedCountry = 'US';

  countries = [
    { value: 'US', label: 'United States', flag: '🇺🇸' },
    { value: 'GB', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'PE', label: 'Peru', flag: '🇵🇪' },
    { value: 'CA', label: 'Canada', flag: '🇨🇦' },
    { value: 'AU', label: 'Australia', flag: '🇦🇺' },
    { value: 'DE', label: 'Germany', flag: '🇩🇪' },
    { value: 'FR', label: 'France', flag: '🇫🇷' },
    { value: 'ES', label: 'Spain', flag: '🇪🇸' },
    { value: 'IT', label: 'Italy', flag: '🇮🇹' },
    { value: 'JP', label: 'Japan', flag: '🇯🇵' }
  ];

  ngOnInit(): void {
    this.loadCountryRanking();
  }

  onCountryChange(): void {
    this.currentPage = 1;
    this.loadCountryRanking();
  }

  loadCountryRanking(): void {
    this.rankingStore.loadRankingByCountry(this.selectedCountry, this.currentPage, this.pageSize);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadCountryRanking();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCountryRanking();
    }
  }

  getSelectedCountryFlag(): string {
    const country = this.countries.find(c => c.value === this.selectedCountry);
    return country ? country.flag : '';
  }

  getSelectedCountryName(): string {
    const country = this.countries.find(c => c.value === this.selectedCountry);
    return country ? country.label : '';
  }

  trackByRanking(index: number, item: RankingPosition): number {
    return item.userId;
  }
}
