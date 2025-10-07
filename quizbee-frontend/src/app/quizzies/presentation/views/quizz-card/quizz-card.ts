import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../../domain/model/quiz.entity';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quizz-card.html',  // 👈 CAMBIAR AQUÍ
  styleUrls: ['./quizz-card.css']    // 👈 CAMBIAR AQUÍ
})
export class QuizCard {  // 👈 Nombre de la clase
  @Input({ required: true }) quiz!: Quiz;
  @Output() quizSelected = new EventEmitter<Quiz>();

  onCardClick(): void {
    this.quizSelected.emit(this.quiz);
  }
}
