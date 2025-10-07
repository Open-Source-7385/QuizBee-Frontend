import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../../domain/model/quiz.entity';
import { Question } from '../../../domain/model/question.entity';
import { QuizApp } from '../../../application/quizz-app';

interface Answer {
  questionId: string;
  selectedAlternativeId: number;
}
@Component({
  selector: 'app-quizz-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz-play.html',
  styleUrls: ['./quizz-play.css']
})
export class QuizzPlay implements OnInit {
  quiz = signal<Quiz | null>(null);
  currentQuestionIndex = signal<number>(0);
  answers = signal<Answer[]>([]);
  lives = signal<number>(5);
  showStartScreen = signal<boolean>(true);
  showReminder = signal<boolean>(true);
  quizCompleted = signal<boolean>(false);
  score = signal<number>(0);

  // Computed
  currentQuestion = computed(() => {
    const q = this.quiz();
    if (!q) return null;
    return q.questions[this.currentQuestionIndex()];
  });

  progress = computed(() => {
    const q = this.quiz();
    if (!q) return 0;
    return ((this.currentQuestionIndex() + 1) / q.questions.length) * 100;
  });

  totalQuestions = computed(() => this.quiz()?.questions.length || 0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizApp
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadQuiz(parseInt(quizId));
    }
  }

  loadQuiz(id: number): void {
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

  startQuiz(showReminder: boolean): void {
    this.showReminder.set(showReminder);
    if (!showReminder) {
      this.showStartScreen.set(false);
    }
  }

  closeReminder(): void {
    this.showStartScreen.set(false);
  }

  selectAnswer(alternativeId: number): void {
    const question = this.currentQuestion();
    if (!question) return;

    // Verificar si la respuesta es correcta
    const correctAlternative = question.getCorrectAlternative();
    // @ts-ignore
    const isCorrect = correctAlternative?.id === alternativeId;

    if (!isCorrect) {
      // Restar una vida si es incorrecta
      this.lives.update(lives => lives - 1);

      if (this.lives() === 0) {
        // Game Over
        this.quizCompleted.set(true);
        return;
      }
    } else {
      // Sumar puntos si es correcta
      this.score.update(score => score + question.points);
    }

    // Guardar respuesta
    this.answers.update(answers => [
      ...answers,
      { questionId: question.id!, selectedAlternativeId: alternativeId }
    ]);

    // Pasar a la siguiente pregunta después de un pequeño delay
    setTimeout(() => {
      this.nextQuestion();
    }, 100);
  }

  nextQuestion(): void {
    const nextIndex = this.currentQuestionIndex() + 1;

    if (nextIndex >= this.totalQuestions()) {
      // Quiz completado
      this.quizCompleted.set(true);
    } else {
      this.currentQuestionIndex.set(nextIndex);
    }
  }

  getAnswerForQuestion(questionId: string): number | undefined {
    return this.answers().find(a => a.questionId === questionId)?.selectedAlternativeId;
  }

  restartQuiz(): void {
    this.currentQuestionIndex.set(0);
    this.answers.set([]);
    this.lives.set(5);
    this.showStartScreen.set(true);
    this.showReminder.set(true);
    this.quizCompleted.set(false);
    this.score.set(0);
  }

  exitQuiz(): void {
    this.router.navigate(['/quizz']);
  }

  getLivesArray(): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  isAnswerSelected(alternativeId: number): boolean {
    const question = this.currentQuestion();
    if (!question) return false;
    return this.getAnswerForQuestion(question.id!) === alternativeId;
  }

  protected readonly String = String;
}
