import { Injectable } from '@angular/core';
import { Quiz } from '../domain/model/quiz.entity';
import { Question } from '../domain/model/question.entity';
import { Alternative } from '../domain/model/alternative.entity';
import { QuizResource} from './quizz.resource';
import { QuestionResource } from './question.resource';
import { AlternativeResource } from './alternative.resource';
import { CreatorResource } from './creator.resource';

@Injectable({
  providedIn: 'root'
})
export class QuizAssembler {

  /**
   * Convierte un Resource de la API a una Entity del dominio
   */
  toEntityFromResource(resource: QuizResource): Quiz {
    return new Quiz({
      id: parseInt(resource.id),
      title: resource.title,
      description: resource.description,
      category: resource.category,
      type: resource.type,
      difficultyLevel: resource.difficultyLevel,
      points: resource.points,
      timeLimit: resource.timeLimit,
      creator: resource.creator,
      createdAt: resource.createdAt,
      plays: resource.plays,
      questions: this.questionsFromResource(resource.questions)
    });
  }

  /**
   * Convierte una Entity del dominio a un Resource para la API
   */
  toResourceFromEntity(entity: Quiz): QuizResource {
    return {
      id: entity.id?.toString() || '',
      title: entity.title,
      description: entity.description,
      category: entity.category,
      type: entity.type,
      difficultyLevel: entity.difficultyLevel,
      points: entity.points,
      timeLimit: entity.timeLimit,
      creator: entity.creator,
      createdAt: entity.createdAt,
      plays: entity.plays,
      questions: this.questionsToResource(entity.questions)
    };
  }

  /**
   * Convierte un array de Resources a Entities
   */
  toEntitiesFromResources(resources: QuizResource[]): Quiz[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }

  // ============= PRIVATE HELPERS =============
  private questionsFromResource(resources: QuestionResource[]): Question[] {
    // @ts-ignore
    return resources.map(resource => new Question({
      id: parseInt(resource.id.replace('q', '')),
      // ✅ aceptar tanto textquestion como text
      textquestion: resource.textquestion ?? resource.textquestion?? '',
      order: resource.order,
      points: resource.points,
      alternatives: this.alternativesFromResource(resource.alternatives)
    }));
  }

  private questionsToResource(questions: Question[]): QuestionResource[] {
    return questions.map((question, index) => ({
      id: `q${question.id || index + 1}`,
      // ✅ siempre enviar textquestion al JSON
      textquestion: question.textquestion,
      order: question.order,
      points: question.points,
      alternatives: this.alternativesToResource(question.alternatives)
    }));
  }

  private alternativesFromResource(resources: AlternativeResource[]): Alternative[] {
    // @ts-ignore
    return resources.map(resource => new Alternative({
      id: parseInt(resource.id.replace('a', '')),
      text: resource.text,
      isCorrect: resource.isCorrect
    }));
  }

  private alternativesToResource(alternatives: Alternative[]): AlternativeResource[] {
    return alternatives.map((alt, index) => ({
      id: `a${alt.id || index + 1}`,
      text: alt.text,
      isCorrect: alt.isCorrect
    }));
  }
}
