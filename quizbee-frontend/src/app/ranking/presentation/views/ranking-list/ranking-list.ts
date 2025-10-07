import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Add this import
import { RankingStore } from '../../../application/ranking-store';

@Component({
  selector: 'app-ranking-list',
  standalone: true,
  imports: [
    CommonModule, // Make sure this is included
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './ranking-list.html',
  styleUrl: './ranking-list.css'
})
export class RankingList {
  // ... your existing component code
}
