// quizbee-frontend/src/app/quizzies/presentation/views/my-creations/my-creations.component.ts

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Quiz } from '../../../domain/model/quiz.entity';
import { QuizApp } from '../../../application/quizz-app';
import { AuthService } from '../../../../shared/core/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-creations',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './my-creations.html',
  styleUrls: ['./my-creations.css']
})
export class MyCreationsComponent implements OnInit {
  // Signals
  myQuizzes = signal<Quiz[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('all');
  currentUser: any = null;

  // Computed
  filteredQuizzes = computed(() => {
    let quizzes = this.myQuizzes();

    // Filtrar por búsqueda
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      quizzes = quizzes.filter(q =>
        q.title.toLowerCase().includes(term) ||
        q.description.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term)
      );
    }

    // Filtrar por categoría
    if (this.selectedCategory() !== 'all') {
      quizzes = quizzes.filter(q => q.category === this.selectedCategory());
    }

    return quizzes;
  });

  categories = computed(() => {
    const cats = new Set(this.myQuizzes().map(q => q.category));
    return Array.from(cats);
  });

  totalQuizzes = computed(() => this.myQuizzes().length);
  totalPlays = computed(() =>
    this.myQuizzes().reduce((sum, q) => sum + q.plays, 0)
  );

  constructor(
    private quizService: QuizApp,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Verificar que sea creador
    if (this.currentUser.role !== 'creador') {
      alert('Solo los creadores pueden acceder a esta sección');
      this.router.navigate(['/quizz']);
      return;
    }

    this.loadMyQuizzes();
  }

  loadMyQuizzes(): void {
    this.loading.set(true);
    this.error.set(null);

    // Obtener todos los quizzes y filtrar por creador actual
    this.quizService.getAllQuizzes().subscribe({
      next: (allQuizzes) => {
        // Filtrar solo los quizzes creados por el usuario actual
        const myQuizzes = allQuizzes.filter(
          quiz => quiz.creator.id === this.currentUser.id
        );

        this.myQuizzes.set(myQuizzes);
        this.loading.set(false);
        console.log(`✅ Cargados ${myQuizzes.length} quizzes del creador`);
      },
      error: (err) => {
        console.error('Error loading quizzes:', err);
        this.error.set('Error al cargar tus creaciones');
        this.loading.set(false);
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
  }

  // Acciones de quiz
  viewQuiz(quiz: Quiz): void {
    this.router.navigate(['/quizz', quiz.id]);
  }

  editQuiz(quiz: Quiz): void {
    this.router.navigate(['/quizz/edit', quiz.id]);
  }

  deleteQuiz(quiz: Quiz): void {
    const confirmed = confirm(
      `¿Estás seguro de eliminar "${quiz.title}"?\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    // TODO: Implementar servicio de eliminación
    alert('Funcionalidad de eliminación próximamente');
  }

  duplicateQuiz(quiz: Quiz): void {
    const confirmed = confirm(
      `¿Deseas crear una copia de "${quiz.title}"?`
    );

    if (!confirmed) return;

    // TODO: Implementar duplicación
    alert('Funcionalidad de duplicación próximamente');
  }

  createNewQuiz(): void {
    this.router.navigate(['/quizz/create']);
  }

  getDifficultyLabel(level: number): string {
    const labels = ['', 'Muy Fácil', 'Fácil', 'Intermedio', 'Difícil', 'Muy Difícil', 'Extremo'];
    return labels[level] || 'Desconocido';
  }

  getStatusBadge(quiz: Quiz): string {
    // Determinar el estado del quiz basado en plays
    if (quiz.plays === 0) return 'new';
    if (quiz.plays < 10) return 'low';
    if (quiz.plays < 100) return 'medium';
    return 'popular';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'new': 'Nuevo',
      'low': 'Poco jugado',
      'medium': 'Popular',
      'popular': 'Muy Popular'
    };
    return labels[status] || '';
  }
}
