import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Quiz } from '../domain/model/quiz.entity';
import { QuizApiService } from '../infrastructure/quizz.api';
@Injectable({
  providedIn: 'root'
})
export class QuizApp {
  // Signals para estado reactivo
  private quizzesSignal = signal<Quiz[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private selectedQuizSignal = signal<Quiz | null>(null);

  // Computed signals públicos
  quizzes = computed(() => this.quizzesSignal());
  loading = computed(() => this.loadingSignal());
  error = computed(() => this.errorSignal());
  selectedQuiz = computed(() => this.selectedQuizSignal());

  // Quizzes populares (ordenados por plays)
  popularQuizzes = computed(() =>
    [...this.quizzesSignal()].sort((a, b) => b.plays - a.plays)
  );

  // Total de quizzes
  totalQuizzes = computed(() => this.quizzesSignal().length);

  constructor(private quizApiService: QuizApiService) {}

  /**
   * Carga todos los quizzes desde la API
   */
  loadAllQuizzes(): Observable<Quiz[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.quizApiService.getAll().pipe(
      tap({
        next: (quizzes) => {
          this.quizzesSignal.set(quizzes);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Obtiene un quiz por ID
   */
  getQuizById(id: string): Observable<Quiz> {
    this.loadingSignal.set(true);

    return this.quizApiService.getById(id).pipe(
      tap({
        next: (quiz) => {
          this.selectedQuizSignal.set(quiz);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  /**
   * Crea un nuevo quiz
   */
  createQuiz(quiz: Quiz): Observable<Quiz> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    return this.quizApiService.create(quiz).pipe(
      tap({
        next: (newQuiz) => {
          this.quizzesSignal.update(quizzes => [...quizzes, newQuiz]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        }
      })
    );
  }
  incrementQuizPlays(id: string, currentPlays: number): Observable<Quiz> {
    return this.quizApiService.incrementPlays(id, currentPlays);
  }

  /**
   * Actualiza un quiz existente
   */
  updateQuiz(id: number, quiz: Quiz): Observable<Quiz> {
    this.loadingSignal.set(true);

    return this.quizApiService.update(id, quiz).pipe(
      tap({
        next: (updatedQuiz) => {
          this.quizzesSignal.update(quizzes =>
            quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q)
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(error.message);
          this.loadingSignal.set(false);
        }
      })
    );
  }



  /**
   * Busca quizzes por término
   */
  searchQuizzes(term: string): Observable<Quiz[]> {
    return this.quizApiService.search(term).pipe(
      tap({
        next: (quizzes) => {
          this.quizzesSignal.set(quizzes);
        }
      })
    );
  }

  /**
   * Filtra quizzes por categoría
   */
  filterByCategory(category: string): Quiz[] {
    if (category === 'all') {
      return this.quizzesSignal();
    }
    return this.quizzesSignal().filter(q => q.category === category);
  }

  /**
   * Filtra quizzes por nivel de dificultad
   */
  filterByDifficulty(level: number): Quiz[] {
    if (level === 0) {
      return this.quizzesSignal();
    }
    return this.quizzesSignal().filter(q => q.difficultyLevel === level);
  }

  /**
   * Filtra quizzes por tipo
   */
  filterByType(type: string): Quiz[] {
    if (type === 'all') {
      return this.quizzesSignal();
    }
    return this.quizzesSignal().filter(q => q.type === type);
  }

  /**
   * Obtiene las categorías únicas
   */
  getUniqueCategories(): string[] {
    const categories = this.quizzesSignal().map(q => q.category);
    return [...new Set(categories)];
  }

  /**
   * Limpia el error
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Selecciona un quiz
   */
  selectQuiz(quiz: Quiz): void {
    this.selectedQuizSignal.set(quiz);
  }

  /**
   * Limpia la selección
   */
  clearSelection(): void {
    this.selectedQuizSignal.set(null);
  }

  getAllQuizzes() {
    return this.quizApiService.getAll();
  }

}
