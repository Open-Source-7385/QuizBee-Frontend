export class TimeMetrics {
  constructor(
    public readonly timeSpentSeconds: number,
    public readonly averageTimePerQuestion: number,
    public readonly efficiencyScore: number
  ) {}

  static calculate(timeSpentSeconds: number, totalQuestions: number): TimeMetrics {
    const averageTime = totalQuestions > 0 ? timeSpentSeconds / totalQuestions : 0;
    const efficiency = totalQuestions > 0 ? (totalQuestions / timeSpentSeconds) * 60 : 0; // questions per minute

    return new TimeMetrics(timeSpentSeconds, averageTime, efficiency);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeSpentSeconds / 60);
    const seconds = this.timeSpentSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
