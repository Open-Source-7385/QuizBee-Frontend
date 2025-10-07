import {RankingBaseEntity} from '../../../shared/infrastructure/ranking-base-entity';

export class Ranking implements RankingBaseEntity {
  private _id: number;
  private _userId: number;
  private _userName: string;
  private _score: number;
  private _level: string;
  private _country: string;
  private _quizCount: number;
  private _averageScore: number;
  private _rankPosition: number;
  private _updatedAt: string;

  constructor(ranking: {
    id: number;
    userId: number;
    userName: string;
    score: number;
    level: string; // Changed from number to string to match the property type
    country?: string;
    quizCount: number;
    averageScore: number;
    rankPosition: number;
    updatedAt: string;
  }) {
    this._id = ranking.id;
    this._userId = ranking.userId;
    this._userName = ranking.userName;
    this._score = ranking.score;
    this._level = ranking.level;
    this._country = ranking.country || '';
    this._quizCount = ranking.quizCount;
    this._averageScore = ranking.averageScore;
    this._rankPosition = ranking.rankPosition;
    this._updatedAt = ranking.updatedAt;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }

  get userName(): string { return this._userName; }
  set userName(value: string) { this._userName = value; }

  get score(): number { return this._score; }
  set score(value: number) { this._score = value; }

  get level(): string { return this._level; }
  set level(value: string) { this._level = value; }

  get country(): string { return this._country; }
  set country(value: string) { this._country = value; }

  get quizCount(): number { return this._quizCount; }
  set quizCount(value: number) { this._quizCount = value; }

  get averageScore(): number { return this._averageScore; }
  set averageScore(value: number) { this._averageScore = value; }

  get rankPosition(): number { return this._rankPosition; }
  set rankPosition(value: number) { this._rankPosition = value; }

  get updatedAt(): string { return this._updatedAt; }
  set updatedAt(value: string) { this._updatedAt = value; }
}
