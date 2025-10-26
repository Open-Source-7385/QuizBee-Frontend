import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../domain/model/plan.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanRepository {
  private apiUrl = `${environment.apiUrl}/plans`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.apiUrl);
  }

  getById(id: string): Observable<Plan> {
    return this.http.get<Plan>(`${this.apiUrl}/${id}`);
  }
}
