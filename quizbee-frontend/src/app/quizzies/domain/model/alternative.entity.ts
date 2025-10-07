export class Alternative  {
  id: string;
  text: string;
  isCorrect: boolean;


  constructor(init?: Partial<Alternative>) {
    this.id = init?.id ?? '';
    this.text = init?.text ?? '';
    this.isCorrect = init?.isCorrect ?? false;
  }

}
