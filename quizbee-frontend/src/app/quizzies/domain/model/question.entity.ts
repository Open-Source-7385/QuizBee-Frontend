import { Alternative } from './alternative.entity';

export class Question   {
  id:string;
  textquestion: string;
  order: number;
  points: number;
  alternatives: Alternative[];

  constructor(init?: Partial<Question>) {
    this.id = init?.id ?? '';
    this.textquestion = init?.textquestion ?? '';
    this.order = init?.order ?? 0;
    this.points = init?.points ?? 0;
    this.alternatives = init?.alternatives ?? [];
  }
  hasCorrectAnswer(): boolean {
    return this.alternatives.some(alt => alt.isCorrect);
  }

  getCorrectAlternative(): Alternative | undefined {
    return this.alternatives.find(alt => alt.isCorrect);
  }
}
