import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plan } from '../domain/model/plan.model';
import { PlanRepository } from '../infrastructure/plan.repository';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  constructor(private planRepository: PlanRepository) {}

  getAllPlans(): Observable<Plan[]> {
    return this.planRepository.getAll();
  }

  getPlanById(id: string): Observable<Plan> {
    return this.planRepository.getById(id);
  }
}
