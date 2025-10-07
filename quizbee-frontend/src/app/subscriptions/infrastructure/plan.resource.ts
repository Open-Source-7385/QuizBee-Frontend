import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../../shared/infrastructure/base-api';
import { Plan } from '../domain/model/plan.entity';
import { PlanAssembler } from './quizz.assembler';
import { PlanResponse } from './quizz.response';

@Injectable({
  providedIn: 'root'
})
export class PlanResource extends BaseApi {
  private endpoint = 'plans';

  constructor(
    http: any,
    private assembler: PlanAssembler
  ) {
    super(http);
  }

  getAll(): Observable<Plan[]> {
    return this.get<PlanResponse[]>(this.getEndpoint(this.endpoint))
      .pipe(map(responses => this.assembler.toEntityList(responses)));
  }

  getById(id: string): Observable<Plan> {
    return this.get<PlanResponse>(this.getEndpoint(`${this.endpoint}/${id}`))
      .pipe(map(response => this.assembler.toEntity(response)));
  }
}
