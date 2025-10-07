import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Quiz } from '../domain/model/quiz.entity';
import { QuizResource } from './quizz.resource';
import { QuizAssembler } from './quizz.assembler';
@Injectable({
  providedIn: 'root'
})
export class QuizApiService {
  private readonly apiUrl = `${environment.platformProviderApiBaseUrl}/quizzes`;

  constructor(
    private http: HttpClient,
    private assembler: QuizAssembler
  ) {}

  /**
   * Obtiene todos los quizzes
   */
  getAll(): Observable<Quiz[]> {
    return this.http.get<QuizResource[]>(this.apiUrl).pipe(
      map(resources => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to fetch quizzes'))
    );
  }

  /**
   * Obtiene un quiz por ID
   */
  getById(id: string): Observable<Quiz> {
    return this.http.get<QuizResource>(`${this.apiUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch quiz'))
    );
  }

  /**
   * Crea un nuevo quiz
   */
  create(quiz: Quiz): Observable<Quiz> {
    const resource = this.assembler.toResourceFromEntity(quiz);
    return this.http.post<QuizResource>(this.apiUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create quiz'))
    );
  }

  /**
   * Actualiza un quiz existente
   */
  update(id: number, quiz: Quiz): Observable<Quiz> {
    const resource = this.assembler.toResourceFromEntity(quiz);
    return this.http.put<QuizResource>(`${this.apiUrl}/${id}`, resource).pipe(
      map(updated => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update quiz'))
    );
  }

  /**
   * Elimina un quiz
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('Failed to delete quiz'))
    );
  }

  /**
   * Busca quizzes por término
   */
  search(term: string): Observable<Quiz[]> {
    return this.http.get<QuizResource[]>(`${this.apiUrl}?q=${term}`).pipe(
      map(resources => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to search quizzes'))
    );
  }

  /**
   * Filtra quizzes por categoría
   */
  getByCategory(category: string): Observable<Quiz[]> {
    return this.http.get<QuizResource[]>(`${this.apiUrl}?category=${category}`).pipe(
      map(resources => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to filter by category'))
    );
  }

  /**
   * Filtra quizzes por nivel de dificultad
   */
  getByDifficulty(level: number): Observable<Quiz[]> {
    return this.http.get<QuizResource[]>(`${this.apiUrl}?difficultyLevel=${level}`).pipe(
      map(resources => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to filter by difficulty'))
    );
  }

  /**
   * Obtiene los quizzes más populares
   */
  getPopular(limit: number = 10): Observable<Quiz[]> {
    return this.http.get<QuizResource[]>(`${this.apiUrl}?_sort=plays&_order=desc&_limit=${limit}`).pipe(
      map(resources => this.assembler.toEntitiesFromResources(resources)),
      catchError(this.handleError('Failed to fetch popular quizzes'))
    );
  }
  /**
   * Incrementa el número de reproducciones (plays)
   */
  incrementPlays(id: string, currentPlays: number): Observable<Quiz> {
    const updatedData = { plays: currentPlays + 1 };
    return this.http.patch<QuizResource>(`${this.apiUrl}/${id}`, updatedData).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to increment plays'))
    );
  }

  /**
   * Maneja errores HTTP
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;

      if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.status === 400) {
        errorMessage = `${operation}: Bad request`;
      } else if (error.status === 500) {
        errorMessage = `${operation}: Server error`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.statusText || 'Unexpected error'}`;
      }

      console.error(errorMessage, error);
      return throwError(() => new Error(errorMessage));
    };
  }
}
