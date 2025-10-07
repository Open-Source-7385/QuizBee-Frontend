import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Quiz } from '../../../domain/model/quiz.entity';
import { Question } from '../../../domain/model/question.entity';
import { Alternative } from '../../../domain/model/alternative.entity';
import {Observable} from 'rxjs';
import { QuizApp } from '../../../application/quizz-app';

interface QuestionForm {
  textquestion: string;
  points: number;
  alternatives: { text: string; isCorrect: boolean; }[];
}

@Component({
  selector: 'app-quizz-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quizz-create.html',
  styleUrls: ['./quizz-create.css']
})
export class QuizzCreate implements OnInit {
  // Basic quiz signals (nombres coherentes con el template)
  quizTitle = signal<string>('');
  quizDescription = signal<string>('');
  quizCategory = signal<string>('');
  quizDifficulty = signal<number>(1);
  quizType = signal<string>('questions');
  quizTimeLimit = signal<number>(600);

  // Lista de preguntas (form model)
  questions = signal<QuestionForm[]>([]);

  // Estado
  saving = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Índice de la pregunta actualmente editada
  currentQuestionIndex = signal<number>(0);

  // Opciones
  categories = ['Present Simple', 'Phrasal Verbs', 'Vocabulario', 'Grammar', 'Reading', 'Listening'];
  difficulties = [
    { value: 1, label: 'Muy Fácil' },
    { value: 2, label: 'Fácil' },
    { value: 3, label: 'Intermedio' },
    { value: 4, label: 'Difícil' },
    { value: 5, label: 'Muy Difícil' },
    { value: 5, label: 'Extremo' }
  ];
  types = [
    { value: 'questions', label: 'Preguntas' },
    { value: 'true-false', label: 'Verdadero/Falso' }

  ];

  // Computed helpers
  currentQuestion = computed(() => {
    const qs = this.questions();
    const idx = this.currentQuestionIndex();
    return qs && qs[idx] ? qs[idx] : null;
  });

  totalPoints = computed(() => {
    return this.questions().reduce((s, q) => s + (Number(q.points) || 0), 0);
  });

  constructor(
    private router: Router,
    private quizService: QuizApp
  ) {}

  ngOnInit(): void {
    // Inicializamos con 3 preguntas vacías
    this.addQuestion();
    this.addQuestion();
    this.addQuestion();
  }

  // ----- Preguntas (form) -----
  addQuestion(): void {
    const newQ: QuestionForm = {
      textquestion: '',
      points: 10,
      alternatives: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]
    };
    this.questions.update(qs => [...qs, newQ]);
    // seleccionamos la última agregada
    this.currentQuestionIndex.set(this.questions().length - 1);
  }

  removeQuestion(index: number): void {
    if (this.questions().length <= 1) {
      alert('Debe haber al menos una pregunta');
      return;
    }
    this.questions.update(qs => qs.filter((_, i) => i !== index));
    // ajusta índice actual
    const len = this.questions().length;
    if (this.currentQuestionIndex() >= len) {
      this.currentQuestionIndex.set(Math.max(0, len - 1));
    }
  }

  selectQuestion(index: number): void {
    this.currentQuestionIndex.set(index);
  }

  // actualizaciones desde template
  updateQuestionText(value: string): void {
    const idx = this.currentQuestionIndex();
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, alternatives: q.alternatives.map(a => ({...a})) }));
      copy[idx].textquestion = value;
      return copy;
    });
  }

  updateQuestionPoints(points: number): void {
    const idx = this.currentQuestionIndex();
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, alternatives: q.alternatives.map(a => ({...a})) }));
      copy[idx].points = Number(points) || 0;
      return copy;
    });
  }

  updateAlternativeText(altIndex: number, value: string): void {
    const idx = this.currentQuestionIndex();
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, alternatives: q.alternatives.map(a => ({...a})) }));
      copy[idx].alternatives[altIndex].text = value;
      return copy;
    });
  }

  toggleCorrectAlternative(altIndex: number): void {
    const idx = this.currentQuestionIndex();
    this.questions.update(qs => {
      const copy = qs.map(q => ({ ...q, alternatives: q.alternatives.map(a => ({...a})) }));
      copy[idx].alternatives.forEach((a, i) => a.isCorrect = i === altIndex);
      return copy;
    });
  }

  // ----- Validaciones -----
  private isQuestionValid(question: QuestionForm): boolean {
    const hasText = (question.textquestion || '').trim().length > 0;
    const allAlternativesHaveText = question.alternatives.every(a => (a.text || '').trim().length > 0);
    const hasCorrectAnswer = question.alternatives.some(a => a.isCorrect);
    return hasText && allAlternativesHaveText && hasCorrectAnswer;
  }

  canAddQuestion(): boolean {
    return this.questions().length < 12; // límite arbitrario
  }

  canSaveQuiz(): boolean {
    const title = (this.quizTitle() || '').trim().length > 0;
    const category = (this.quizCategory() || '').trim().length > 0;
    const qs = this.questions();
    const allValid = qs.length > 0 && qs.every(q => this.isQuestionValid(q));
    return title && category && allValid;
  }

  // ----- Borrador -----
  saveDraft(): void {
    const draft = {
      title: this.quizTitle(),
      description: this.quizDescription(),
      category: this.quizCategory(),
      difficultyLevel: this.quizDifficulty(),
      type: this.quizType(),
      timeLimit: this.quizTimeLimit(),
      questions: this.questions()
    };
    localStorage.setItem('quiz_draft', JSON.stringify(draft));
    this.successMessage.set('Borrador guardado correctamente');
    setTimeout(() => this.successMessage.set(null), 2500);
  }

  loadDraft(): void {
    const raw = localStorage.getItem('quiz_draft');
    if (!raw) {
      this.errorMessage.set('No hay borrador guardado');
      setTimeout(() => this.errorMessage.set(null), 2500);
      return;
    }
    try {
      const data = JSON.parse(raw);
      this.quizTitle.set(data.title ?? '');
      this.quizDescription.set(data.description ?? '');
      this.quizCategory.set(data.category ?? '');
      this.quizDifficulty.set(data.difficultyLevel ?? 1);
      this.quizType.set(data.type ?? 'questions');
      this.quizTimeLimit.set(data.timeLimit ?? 600);
      this.questions.set(data.questions ?? []);
      this.successMessage.set('Borrador cargado');
      setTimeout(() => this.successMessage.set(null), 2000);
    } catch (err) {
      this.errorMessage.set('Error al cargar borrador');
      setTimeout(() => this.errorMessage.set(null), 2500);
    }
  }

  // ----- Publicar -----
  async saveQuiz(): Promise<void> {
    if (!this.canSaveQuiz()) {
      alert('Completa todos los campos y marca una respuesta correcta por pregunta.');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Construir el objeto que enviamos al backend (estructura acorde a tu db.json)
    const quizPayload: any = {
      // id lo deja el servidor (o string vacío)
      id: '',
      title: this.quizTitle(),
      description: this.quizDescription(),
      category: this.quizCategory(),
      type: this.quizType(),
      difficultyLevel: this.quizDifficulty(),
      points: this.totalPoints(),
      timeLimit: this.quizTimeLimit(),
      creator: { id: 'user-1', name: 'Usuario Actual', avatar: '👤' },
      createdAt: new Date().toISOString(),
      plays: 0,
      questions: this.questions().map((q, qi) => ({
        id: `q${qi + 1}`,
        textquestion: q.textquestion,
        order: qi + 1,
        points: q.points,
        alternatives: q.alternatives.map((a, ai) => ({
          id: `a${ai + 1}`,
          text: a.text,
          isCorrect: a.isCorrect
        }))
      }))
    };

    this.quizService.createQuiz(quizPayload as Quiz).subscribe({
      next: (created) => {
        this.saving.set(false);
        this.successMessage.set('Quiz publicado correctamente');
        localStorage.removeItem('quiz_draft');
        setTimeout(() => this.router.navigate(['/quizz']), 800);
      },
      error: (err) => {
        console.error(err);
        this.saving.set(false);
        this.errorMessage.set('Error al publicar el quiz. Intenta de nuevo.');
      }
    });
  }

  cancel(): void {
    if (confirm('¿Estás seguro de cancelar? Se perderán los cambios.')) {
      this.router.navigate(['/quizz']);
    }
  }

  // helpers para template
  savingMessage(): boolean { return this.saving(); } // opcional
  // trackBy
  trackByQuestion(index: number, item: QuestionForm) { return index; }
  trackByAlternative(index: number, item: {text:string}) { return index; }
  trackByIndex = (index: number) => index;
}
