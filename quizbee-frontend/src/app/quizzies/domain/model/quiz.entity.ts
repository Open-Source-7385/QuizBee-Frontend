import { Question } from './question.entity';

export interface Creator {
  id: string;
  name: string;
  avatar: string;
}

export class Quiz   {
  id : string;
  title: string;
  description: string;
  category: string;
  type: string;
  difficultyLevel: number;
  points: number;
  timeLimit: number;
  creator: Creator;
  createdAt: string;
  plays: number;
  questions: Question[];

  constructor(data: Partial<Quiz> = {}) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.type = data.type || 'questions';
    this.difficultyLevel = data.difficultyLevel || 1;
    this.points = data.points || 0;
    this.timeLimit = data.timeLimit || 600;
    this.creator = data.creator || { id: '', name: '', avatar: '' };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.plays = data.plays || 0;
    this.questions = data.questions || [];
  }

  getTotalPoints(): number {
    return this.questions.reduce((sum, q) => sum + q.points, 0);
  }

  getTotalQuestions(): number {
    return this.questions.length;
  }

  getDifficultyStars(): string {
    return '⭐'.repeat(this.difficultyLevel);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLimit / 60);
    return `${minutes} min`;
  }

  isValid(): boolean {
    return (
      this.title.length > 0 &&
      this.questions.length > 0 &&
      this.questions.every(q => q.hasCorrectAnswer())
    );
  }
}
