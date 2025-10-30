import { AlternativeResource } from './alternative.resource';

export interface QuestionResource {
  id: string;
  textquestion: string;
  order: number;
  points: number;
  alternatives: AlternativeResource[];
}
