export class QuizAttempt {
  private _id: number;
  private _userId: number;
  private _quizId: number;
  private _score: number;
  private _totalQuestions: number;
  private _correctAnswers: number;
  private _timeSpent: number;
  private _completedAt: Date;
  private _difficultyLevel: string;
  private _status: 'completed' | 'abandoned' | 'timed_out';

  constructor(attempt: {
    id: number;
    userId: number;
    quizId: number;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    completedAt: Date;
    difficultyLevel: string;
    status: 'completed' | 'abandoned' | 'timed_out';
  }) {
    this._id = attempt.id;
    this._userId = attempt.userId;
    this._quizId = attempt.quizId;
    this._score = attempt.score;
    this._totalQuestions = attempt.totalQuestions;
    this._correctAnswers = attempt.correctAnswers;
    this._timeSpent = attempt.timeSpent;
    this._completedAt = attempt.completedAt;
    this._difficultyLevel = attempt.difficultyLevel;
    this._status = attempt.status;
  }

  // Getters and setters
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get userId(): number { return this._userId; }
  set userId(value: number) { this._userId = value; }

  get quizId(): number { return this._quizId; }
  set quizId(value: number) { this._quizId = value; }

  get score(): number { return this._score; }
  set score(value: number) { this._score = value; }

  get totalQuestions(): number { return this._totalQuestions; }
  set totalQuestions(value: number) { this._totalQuestions = value; }

  get correctAnswers(): number { return this._correctAnswers; }
  set correctAnswers(value: number) { this._correctAnswers = value; }

  get timeSpent(): number { return this._timeSpent; }
  set timeSpent(value: number) { this._timeSpent = value; }

  get completedAt(): Date { return this._completedAt; }
  set completedAt(value: Date) { this._completedAt = value; }

  get difficultyLevel(): string { return this._difficultyLevel; }
  set difficultyLevel(value: string) { this._difficultyLevel = value; }

  get status(): 'completed' | 'abandoned' | 'timed_out' { return this._status; }
  set status(value: 'completed' | 'abandoned' | 'timed_out') { this._status = value; }

  // Business logic methods
  calculateSuccessRate(): number {
    return this.totalQuestions > 0 ? (this.correctAnswers / this.totalQuestions) * 100 : 0;
  }

  calculateTimeEfficiency(): number {
    return this.timeSpent > 0 ? (this.correctAnswers / this.timeSpent) * 60 : 0; // answers per minute
  }
}
