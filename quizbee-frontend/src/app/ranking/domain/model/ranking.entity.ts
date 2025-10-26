import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export class Ranking implements BaseEntity {
  private _id: number;
  private _userId: number;
  private _quizId: number;
  private _score: number;
  private _timeSpent: number;
  private _completedAt: Date;

  constructor(ranking: {
    id: number;
    userId: number;
    quizId: number;
    score: number;
    timeSpent: number;
    completedAt: Date | string;
  }) {
    this._id = ranking.id;
    this._userId = ranking.userId;
    this._quizId = ranking.quizId;
    this._score = ranking.score;
    this._timeSpent = ranking.timeSpent;
    this._completedAt = typeof ranking.completedAt === 'string'
      ? new Date(ranking.completedAt)
      : ranking.completedAt;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }

  get quizId(): number { return this._quizId; }
  set quizId(value: number) { this._quizId = value; }

  get score(): number { return this._score; }
  set score(value: number) { this._score = value; }

  get timeSpent(): number { return this._timeSpent; }
  set timeSpent(value: number) { this._timeSpent = value; }

  get completedAt(): Date { return this._completedAt; }
  set completedAt(value: Date) { this._completedAt = value; }
}
