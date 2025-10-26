import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export class UserScore implements BaseEntity {
  private _id: number;
  private _userId: number;
  private _totalScore: number;
  private _averageScore: number;
  private _quizzesCompleted: number;
  private _rank: number;

  constructor(userScore: {
    id: number;
    userId: number;
    totalScore: number;
    averageScore: number;
    quizzesCompleted: number;
    rank: number;
  }) {
    this._id = userScore.id;
    this._userId = userScore.userId;
    this._totalScore = userScore.totalScore;
    this._averageScore = userScore.averageScore;
    this._quizzesCompleted = userScore.quizzesCompleted;
    this._rank = userScore.rank;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }

  get totalScore(): number { return this._totalScore; }
  set totalScore(value: number) { this._totalScore = value; }

  get averageScore(): number { return this._averageScore; }
  set averageScore(value: number) { this._averageScore = value; }

  get quizzesCompleted(): number { return this._quizzesCompleted; }
  set quizzesCompleted(value: number) { this._quizzesCompleted = value; }

  get rank(): number { return this._rank; }
  set rank(value: number) { this._rank = value; }
}
