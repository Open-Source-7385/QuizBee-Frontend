import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../../domain/model/quiz.entity';
import { Question } from '../../../domain/model/question.entity';
import { QuizApp } from '../../../application/quizz-app';

interface Answer {
  questionId: string;
  selectedAlternativeId: string;
  isCorrect: boolean;
  timeSpent: number;
}

@Component({
  selector: 'app-quizz-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz-play.html',
  styleUrls: ['./quizz-play.css']
})
export class QuizzPlay implements OnInit {
  // Signals principales
  quiz = signal<Quiz | null>(null);
  currentQuestionIndex = signal<number>(0);
  answers = signal<Answer[]>([]);
  startTime = signal<number>(0);
  showResults = signal<boolean>(false);
  showReview = signal<boolean>(false);

  // Computed signals
  currentQuestion = computed(() => {
    const q = this.quiz();
    if (!q || !q.questions.length) return null;
    return q.questions[this.currentQuestionIndex()];
  });

  totalQuestions = computed(() => this.quiz()?.questions.length || 0);

  answeredCount = computed(() => this.answers().length);

  correctCount = computed(() =>
    this.answers().filter(a => a.isCorrect).length
  );

  incorrectCount = computed(() =>
    this.answers().filter(a => !a.isCorrect).length
  );

  unansweredCount = computed(() =>
    this.totalQuestions() - this.answeredCount()
  );

  totalTime = computed(() => {
    if (!this.showResults()) return 0;
    return this.answers().reduce((sum, a) => sum + a.timeSpent, 0);
  });

  score = computed(() => {
    return this.answers()
      .filter(a => a.isCorrect)
      .reduce((sum, a) => {
        const question = this.getQuestionById(a.questionId);
        return sum + (question?.points || 0);
      }, 0);
  });

  accuracy = computed(() => {
    const answered = this.answeredCount();
    if (answered === 0) return 0;
    return Math.round((this.correctCount() / answered) * 100);
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizApp
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId && quizId !== 'create') {
      this.loadQuiz(quizId);
    }
  }

  loadQuiz(id: string): void {
    this.quizService.getQuizById(id).subscribe({
      next: (quiz) => {
        this.quiz.set(quiz);
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        alert('Error al cargar el quiz');
        this.router.navigate(['/quizz']);
      }
    });
  }

  selectAnswer(alternativeId: string): void {
    const question = this.currentQuestion();
    if (!question) return;

    // Verificar si ya respondió esta pregunta
    const existingAnswer = this.answers().find(a => a.questionId === question.id);
    if (existingAnswer) return;

    // Calcular tiempo
    // @ts-ignore
    const timeSpent = Math.floor((Date.now() - this.startTime.set()) / 1000);

    // Verificar si es correcta
    const correctAlternative = question.getCorrectAlternative();
    // @ts-ignore
    const isCorrect = correctAlternative?.id === alternativeId;

    // Guardar respuesta
    this.answers.update(answers => [
      ...answers,
      {
        questionId: question.id,
        selectedAlternativeId: alternativeId,
        isCorrect,
        timeSpent
      }
    ]);

    // Esperar un momento para mostrar feedback visual
    setTimeout(() => {
      this.nextQuestion();
    }, 800);
  }

  nextQuestion(): void {
    const nextIndex = this.currentQuestionIndex() + 1;

    if (nextIndex >= this.totalQuestions()) {
      // Quiz completado
      this.showResults.set(true);
    } else {
      this.currentQuestionIndex.set(nextIndex);
    }
  }

  previousQuestion(): void {
    const prevIndex = this.currentQuestionIndex() - 1;
    if (prevIndex >= 0) {
      this.currentQuestionIndex.set(prevIndex);
    }
  }

  goToQuestion(index: number): void {
    this.currentQuestionIndex.set(index);
  }

  getAnswerForQuestion(questionId: string): Answer | undefined {
    return this.answers().find(a => a.questionId === questionId);
  }

  isAnswered(questionId: string): boolean {
    return this.answers().some(a => a.questionId === questionId);
  }

  isCorrectAnswer(questionId: string): boolean {
    const answer = this.getAnswerForQuestion(questionId);
    return answer?.isCorrect || false;
  }

  getQuestionById(questionId: string): Question | undefined {
    return this.quiz()?.questions.find(q => q.id === questionId);
  }

  getAlternativeClass(alternativeId: string): string {
    const question = this.currentQuestion();
    if (!question) return '';

    const answer = this.getAnswerForQuestion(question.id);
    if (!answer) return '';

    const correctAlt = question.getCorrectAlternative();

    // Si es la respuesta seleccionada
    if (answer.selectedAlternativeId === alternativeId) {
      return answer.isCorrect ? 'correct' : 'incorrect';
    }

    // Mostrar la correcta si respondió mal
    // @ts-ignore
    if (!answer.isCorrect && correctAlt?.id === alternativeId) {
      return 'correct-highlight';
    }

    return '';
  }

  showCorrections(): void {
    this.showReview.set(true);
    this.currentQuestionIndex.set(0);
  }

  closeReview(): void {
    this.showReview.set(false);
    this.showResults.set(true);
  }

  restartQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.answers.set([]);
    this.showResults.set(false);
    this.showReview.set(false);
    this.startTime.set(Date.now());
  }

  exitQuiz(): void {
    this.router.navigate(['/quizz']);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getQuestionStatusClass(index: number): string {
    const question = this.quiz()?.questions[index];
    if (!question) return '';

    const answer = this.getAnswerForQuestion(question.id);
    if (!answer) return 'unanswered';

    return answer.isCorrect ? 'correct' : 'incorrect';
  }

  protected readonly String = String;
}
