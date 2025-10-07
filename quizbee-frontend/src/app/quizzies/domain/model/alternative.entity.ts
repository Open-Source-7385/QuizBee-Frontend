export class Alternative  {
  id: string;
  text: string;
  isCorrect: boolean;


  constructor(data?: Partial<Alternative>) {
    this.id = data?.id ?? '';
    this.text = data?.text ?? '';
    this.isCorrect = data?.isCorrect ?? false;
  }

}
