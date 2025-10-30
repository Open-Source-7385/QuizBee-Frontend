// quizbee-frontend/src/app/quizzies/presentation/views/quizz-play/quizz-play.ts
// ✅ VERSIÓN COMPLETA CON SISTEMA DE VIDAS Y PUNTOS

import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Quiz } from '../../../domain/model/quiz.entity';
import { Question } from '../../../domain/model/question.entity';
import { QuizApp } from '../../../application/quizz-app';
import { Answer } from '../../../domain/model/answer.entity';
import { AuthService } from '../../../../shared/core/auth.service';
import { UserStatsService } from '../../../../shared/core/user-stats.service';

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
  showNoLivesModal = signal<boolean>(false); // ✅ NUEVO

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

  // ✅ Nuevo: computed para verificar si pasó el quiz
  passedQuiz = computed(() => this.correctCount() >= 7);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizApp,
    private userStatsService: UserStatsService, // ✅ AGREGAR
    private authService: AuthService // ✅ AGREGAR
  ) {}

  ngOnInit(): void {
    // ✅ VERIFICAR SI TIENE VIDAS ANTES DE EMPEZAR
    if (!this.userStatsService.canPlayQuiz()) {
      this.showNoLivesModal.set(true);
      return;
    }

    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId && quizId !== 'create') {
      this.loadQuiz(quizId);
      this.startTime.set(Date.now()); // ✅ Iniciar timer
    }
  }

  loadQuiz(id: string): void {
    this.quizService.getQuizById(id).subscribe({
      next: (quiz) => {
        this.quiz.set(quiz);

        // Incrementar plays
        this.quizService.incrementQuizPlays(quiz.id, quiz.plays).subscribe({
          next: (updatedQuiz) => {
            this.quiz.set(updatedQuiz);
            console.log(`✅ Plays incrementado a: ${updatedQuiz.plays}`);
          },
          error: (err) => {
            console.error('Error incrementando plays:', err);
          }
        });
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

    const existingAnswer = this.answers().find(a => a.questionId === question.id);
    if (existingAnswer) return;

    // ✅ Calcular tiempo correctamente
    const timeSpent = Math.floor((Date.now() - this.startTime()) / 1000);

    const correctAlternative = question.getCorrectAlternative();
    const isCorrect = correctAlternative?.id === alternativeId;

    this.answers.update(answers => [
      ...answers,
      {
        questionId: question.id,
        selectedAlternativeId: alternativeId,
        isCorrect,
        timeSpent
      }
    ]);

    setTimeout(() => {
      this.nextQuestion();
    }, 800);
  }

  nextQuestion(): void {
    const nextIndex = this.currentQuestionIndex() + 1;

    if (nextIndex >= this.totalQuestions()) {
      // ✅ QUIZ COMPLETADO - PROCESAR RESULTADO
      this.processQuizCompletion();
    } else {
      this.currentQuestionIndex.set(nextIndex);
    }
  }

  /**
   * ✅ NUEVO: Procesa la finalización del quiz
   */
  private processQuizCompletion(): void {
    const correctAnswers = this.correctCount();
    const totalQuestions = this.totalQuestions();

    console.log(`📊 Quiz completado: ${correctAnswers}/${totalQuestions} correctas`);

    // ✅ Guardar resultado en el servicio (guarda en DB)
    this.userStatsService.completeQuiz(correctAnswers, totalQuestions).subscribe({
      next: () => {
        this.showResults.set(true);

        const passed = correctAnswers >= 7;
        if (!passed && !this.userStatsService.hasSubscription()) {
          const livesLeft = this.userStatsService.lives();
          console.log(`❌ Quiz reprobado. Vidas restantes: ${livesLeft}`);

          if (livesLeft === 0) {
            setTimeout(() => {
              alert('💔 Has perdido tu última vida. ¡Mejora a Premium para vidas ilimitadas!');
            }, 1500);
          } else {
            setTimeout(() => {
              alert(`❌ Has perdido 1 vida. Te quedan ${livesLeft} vidas.`);
            }, 1500);
          }
        } else if (passed) {
          const pointsEarned = 100 + (correctAnswers * 10);
          console.log(`✅ Quiz aprobado! +${pointsEarned} puntos`);
          setTimeout(() => {
            alert(`🎉 ¡Felicidades! Has ganado ${pointsEarned} puntos`);
          }, 1500);
        }
      },
      error: (err) => {
        console.error('Error procesando quiz:', err);
        this.showResults.set(true);
      }
    });
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

    if (answer.selectedAlternativeId === alternativeId) {
      return answer.isCorrect ? 'correct' : 'incorrect';
    }

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
    // ✅ VERIFICAR VIDAS ANTES DE REINICIAR
    if (!this.userStatsService.canPlayQuiz()) {
      this.showNoLivesModal.set(true);
      return;
    }

    this.currentQuestionIndex.set(0);
    this.answers.set([]);
    this.showResults.set(false);
    this.showReview.set(false);
    this.startTime.set(Date.now());
  }

  exitQuiz(): void {
    this.router.navigate(['/quizz']);
  }

  /**
   * ✅ NUEVO: Navegar a planes premium
   */
  goToPremium(): void {
    this.router.navigate(['/plans']);
  }

  /**
   * ✅ NUEVO: Cerrar modal de sin vidas
   */
  closeNoLivesModal(): void {
    this.showNoLivesModal.set(false);
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
