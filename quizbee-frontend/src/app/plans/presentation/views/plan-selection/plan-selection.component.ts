import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Plan } from '../../../domain/model/plan.model';
import { PlanService } from '../../../application/plan.service';

@Component({
  selector: 'app-plan-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-selection.component.html',
  styleUrls: ['./plan-selection.component.css']
})
export class PlanSelectionComponent implements OnInit {
  plans: Plan[] = [];
  loading = true;

  constructor(
    private planService: PlanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.planService.getAllPlans().subscribe({
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

  onSubscribe(plan: Plan): void {
    this.router.navigate(['/payment'], {
      state: { plan }
    });
  }
}
