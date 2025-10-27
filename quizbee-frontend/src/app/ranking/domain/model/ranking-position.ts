export class RankingPosition {
  constructor(
    public readonly position: number,
    public readonly userId: number,
    public readonly totalScore: number,
    public readonly level: string,
    public readonly country: string,
    public readonly username?: string,
    public readonly userAvatar?: string
  ) {}

  /**
   * Calculates ranking position based on score and activity
   */
  static calculatePosition(users: RankingPosition[]): RankingPosition[] {
    return users
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => new RankingPosition(
        index + 1,
        user.userId,
        user.totalScore,
        user.level,
        user.country,
        user.username,
        user.userAvatar
      ));
  }

  get rank(): number {
    return this.position;
  }

  get score(): number {
    return this.totalScore;
  }
}
