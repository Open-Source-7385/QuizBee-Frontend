import { Alternative } from './alternative.entity';

export class Question   {
  id:string;
  textquestion: string;
  order: number;
  points: number;
  alternatives: Alternative[];

  constructor() {
    this .id = '';
    this.textquestion= '';
    this.order = 0;
    this.points = 0;
    this.alternatives = [];
  }

  hasCorrectAnswer(): boolean {
    return this.alternatives.some(alt => alt.isCorrect);
  }

  getCorrectAlternative(): Alternative | undefined {
    return this.alternatives.find(alt => alt.isCorrect);
  }
}
