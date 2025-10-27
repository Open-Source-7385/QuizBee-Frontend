import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class Ranking implements BaseEntity {
  private _id: number;
  private _userId: number;
  private _totalScore: number;
  private _quizzesCompleted: number;
  private _level: string;
  private _country: string;
  private _lastActivity: Date;

  constructor(ranking: {
    id: number;
    userId: number;
    totalScore: number;
    quizzesCompleted: number;
    level: string;
    country: string;
    lastActivity: Date;
  }) {
    this._id = ranking.id;
    this._userId = ranking.userId;
    this._totalScore = ranking.totalScore;
    this._quizzesCompleted = ranking.quizzesCompleted;
    this._level = ranking.level;
    this._country = ranking.country;
    this._lastActivity = ranking.lastActivity;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get userId(): number {
    return this._userId;
  }
  set userId(value: number) {
    this._userId = value;
  }

  get totalScore(): number {
    return this._totalScore;
  }
  set totalScore(value: number) {
    this._totalScore = value;
  }

  get quizzesCompleted(): number {
    return this._quizzesCompleted;
  }
  set quizzesCompleted(value: number) {
    this._quizzesCompleted = value;
  }

  get level(): string {
    return this._level;
  }
  set level(value: string) {
    this._level = value;
  }

  get country(): string {
    return this._country;
  }
  set country(value: string) {
    this._country = value;
  }

  get lastActivity(): Date {
    return this._lastActivity;
  }
  set lastActivity(value: Date) {
    this._lastActivity = value;
  }
}
