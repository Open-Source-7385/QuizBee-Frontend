import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizzApi } from '../../../infrastructure/quizz.api';
import { Plan } from '../../../domain/model/plan.entity';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  plans: Plan[] = [];
  loading = true;

  constructor(
    private quizzApi: QuizzApi,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.quizzApi.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading plans:', error);
        this.loading = false;
      }
    });
  }

  selectPlan(plan: Plan): void {
    this.router.navigate(['/payment'], {
      state: { plan }
    });
  }
}
