import { CreatorResource } from './creator.resource';
import { QuestionResource } from './question.resource';


export interface QuizResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  difficultyLevel: number;
  points: number;
  timeLimit: number;
  creator: CreatorResource;
  createdAt: string;
  plays: number;
  questions: QuestionResource[];
}
