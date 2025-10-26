import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export class Feedback implements BaseEntity {
  private _id: number;
  private _quizId: number;
  private _userId: number;
  private _rating: number;
  private _comment: string;
  private _createdAt?: Date; // Keep optional

  constructor(feedback: {
    id: number;
    quizId: number;
    userId: number;
    rating: number;
    comment: string;
    createdAt?: Date; // Make optional here too
  }) {
    this._id = feedback.id;
    this._quizId = feedback.quizId;
    this._userId = feedback.userId;
    this._rating = feedback.rating;
    this._comment = feedback.comment;
    this._createdAt = feedback.createdAt; // No null handling needed
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get quizId(): number { return this._quizId; }
  set quizId(value: number) { this._quizId = value; }

  get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }

  get rating(): number { return this._rating; }
  set rating(value: number) { this._rating = value; }

  get comment(): string { return this._comment; }
  set comment(value: string) { this._comment = value; }

  get createdAt(): Date | undefined { return this._createdAt; }
  set createdAt(value: Date | undefined) { this._createdAt = value; } // Fix setter type
}
