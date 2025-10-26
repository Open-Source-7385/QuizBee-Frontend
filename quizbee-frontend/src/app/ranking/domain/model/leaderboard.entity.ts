import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export class Leaderboard implements BaseEntity {
  private _id: number;
  private _name: string;
  private _type: string;
  private _startDate: Date;
  private _endDate: Date;

  constructor(leaderboard: {
    id: number;
    name: string;
    type: string;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    this._id = leaderboard.id;
    this._name = leaderboard.name;
    this._type = leaderboard.type;
    this._startDate = typeof leaderboard.startDate === 'string'
      ? new Date(leaderboard.startDate)
      : leaderboard.startDate;
    this._endDate = typeof leaderboard.endDate === 'string'
      ? new Date(leaderboard.endDate)
      : leaderboard.endDate;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }

  get type(): string { return this._type; }
  set type(value: string) { this._type = value; }

  get startDate(): Date { return this._startDate; }
  set startDate(value: Date) { this._startDate = value; }

  get endDate(): Date { return this._endDate; }
  set endDate(value: Date) { this._endDate = value; }
}
