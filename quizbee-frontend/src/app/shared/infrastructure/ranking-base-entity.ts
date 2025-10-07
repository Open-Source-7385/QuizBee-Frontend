export interface RankingBaseEntity {
  /**
   * The unique identifier for the ranking entity.
   */
  id: number;

  /**
   * The user ID associated with this ranking entry
   */
  userId: number;

  /**
   * The score or points in the ranking
   */
  score: number;

  /**
   * The level or category of the ranking
   */
  level: string;

  /**
   * The country for regional rankings
   */
  country?: string;

  /**
   * Timestamp when the ranking was updated
   */
  updatedAt: string;
}
