import {BaseEntity} from '../../../shared/infrastructure/base-entity';
//import {User} from './user.entity';

export class FeedbackResponse implements BaseEntity {
  private _id: number;
  private _feedbackId: number;
  private _creatorId: number;
  private _response: string;
  private _createdAt: Date;
  //private _creator: User | null;

  constructor(response: {
    id: number;
    feedbackId: number;
    creatorId: number;
    response: string;
    createdAt: Date;
    //creator?: User | null
  }) {
    this._id = response.id;
    this._feedbackId = response.feedbackId;
    this._creatorId = response.creatorId;
    this._response = response.response;
    this._createdAt = response.createdAt;
    //this._creator = response.creator ?? null;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get feedbackId(): number { return this._feedbackId; }
  set feedbackId(value: number) { this._feedbackId = value; }

  get creatorId(): number { return this._creatorId; }
  set creatorId(value: number) { this._creatorId = value; }

  get response(): string { return this._response; }
  set response(value: string) { this._response = value; }

  get createdAt(): Date { return this._createdAt; }
  set createdAt(value: Date) { this._createdAt = value; }

  //get creator(): User | null { return this._creator; }
  //set creator(value: User | null) { this._creator = value; }
}
