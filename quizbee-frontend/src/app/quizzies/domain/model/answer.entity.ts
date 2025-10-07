export class Answer {
  questionId: string;
  selectedAlternativeId: string;
  isCorrect: boolean;
  timeSpent: number;
  constructor() {
  this.questionId= '';
  this.selectedAlternativeId= '';
  this.isCorrect= false;
  this.timeSpent= 0;
  }
}
