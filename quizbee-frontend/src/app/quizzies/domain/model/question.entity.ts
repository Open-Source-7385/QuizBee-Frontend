import { Alternative } from './alternative.entity';

export class Question   {
  id:string;
  textquestion: string;
  order: number;
  points: number;
  alternatives: Alternative[];

  constructor(data?: Partial<Question>) {
    this.id = data?.id ?? '';
    this.textquestion = data?.textquestion ?? '';
    this.order = data?.order ?? 0;
    this.points = data?.points ?? 0;
    this.alternatives = data?.alternatives ?? [];
  }
  hasCorrectAnswer(): boolean {
    return this.alternatives.some(alt => alt.isCorrect);
  }

  getCorrectAlternative(): Alternative | undefined {
    return this.alternatives.find(alt => alt.isCorrect);
  }
}
