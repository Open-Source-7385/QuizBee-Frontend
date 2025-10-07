import {Component, OnInit, signal, computed, Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {QuizCard} from '../quizz-card/quizz-card';
import {Quiz}  from '../../../domain/model/quiz.entity';
import {QuizApp} from '../../../application/quizz-app';
import {QuizzPlay} from '../quizz-play/quizz-play';
@Component({
  selector: 'app-quizz-list',
  imports: [CommonModule, QuizCard, FormsModule,QuizzPlay],
  templateUrl: './quizz-list.html',
  styleUrls: ['./quizz-list.css']
})
export class QuizzList implements OnInit {
  searchText = signal<string>('');
  selectedCategory = signal<string>('all');
  selectedLevel = signal<number>(0);
  selectedType = signal<string>('all');

  filteredQuizzes = computed(() => {
    let quizzes = this.quizService.quizzes();

    if (this.searchText()) {
      const search = this.searchText().toLowerCase();
      quizzes = quizzes.filter(q =>
        q.title.toLowerCase().includes(search) ||
        q.description.toLowerCase().includes(search) ||
        q.category.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory() !== 'all') {
      quizzes = quizzes.filter(q => q.category === this.selectedCategory());
    }

    if (this.selectedLevel() !== 0) {
      quizzes = quizzes.filter(q => q.difficultyLevel === this.selectedLevel());
    }

    if (this.selectedType() !== 'all') {
      quizzes = quizzes.filter(q => q.type === this.selectedType());
    }

    return quizzes;
  });

  categories = computed(() => this.quizService.getUniqueCategories());
  loading = computed(() => this.quizService.loading());
  error = computed(() => this.quizService.error());

  constructor(
    private quizService: QuizApp,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    this.quizService.loadAllQuizzes().subscribe({
      next: () => {
        console.log('Quizzes loaded successfully');
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory.set(select.value);
  }

  onLevelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedLevel.set(parseInt(select.value));
  }

  onTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedType.set(select.value);
  }

  onQuizSelected(quiz: Quiz): void {
    this.router.navigate(['/quizz', quiz.id]);
  }

  goToCreateQuiz(): void {
    this.router.navigate(['/quizz/create']);
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedCategory.set('all');
    this.selectedLevel.set(0);
    this.selectedType.set('all');
  }
}
