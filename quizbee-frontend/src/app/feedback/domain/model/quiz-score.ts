export class QuizScore {
  constructor(
    public readonly rawScore: number,
    public readonly maxScore: number,
    public readonly percentage: number
  ) {}

  static calculate(score: number, maxScore: number): QuizScore {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return new QuizScore(score, maxScore, percentage);
  }

  getFormattedPercentage(): string {
    return `${this.percentage.toFixed(1)}%`;
  }

  isPassing(passingThreshold: number = 60): boolean {
    return this.percentage >= passingThreshold;
  }
}
