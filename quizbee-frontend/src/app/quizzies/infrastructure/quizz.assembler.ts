import { Injectable } from '@angular/core';
import { Quiz } from '../domain/model/quiz.entity';
import { Question } from '../domain/model/question.entity';
import { Alternative } from '../domain/model/alternative.entity';
import { QuizResource } from './quizz.resource';
import { QuestionResource } from './question.resource';
import { AlternativeResource } from './alternative.resource';

@Injectable({
  providedIn: 'root'
})
export class QuizAssembler {

  /**
   * Convierte un Resource de la API a una Entity del dominio
   */
  toEntityFromResource(resource: QuizResource): Quiz {

    return new Quiz({
      id: resource.id,
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
      id: entity.id || '',
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
    return resources.map(resource => {
      const question = new Question();
      question.id = resource.id; // ✅ mantener string
      question.textquestion = resource.textquestion ?? resource.textquestion ?? '';
      question.order = resource.order;
      question.points = resource.points;
      question.alternatives = this.alternativesFromResource(resource.alternatives);
      return question;
    });
  }


  private questionsToResource(questions: Question[]): QuestionResource[] {
    if (!questions) return [];
    return questions.map((question, index) => ({
      id: question.id || `q${index + 1}`,
      textquestion: question.textquestion,
      order: question.order,
      points: question.points,
      alternatives: this.alternativesToResource(question.alternatives)
    }));
  }

  private alternativesFromResource(resources: AlternativeResource[]): Alternative[] {
    return resources.map(resource => {
      const alt = new Alternative();
      alt.id = resource.id;
      alt.text = resource.text;
      alt.isCorrect = resource.isCorrect;
      return alt;
    });
  }


  private alternativesToResource(alternatives: Alternative[]): AlternativeResource[] {
    if (!alternatives) return [];
    // @ts-ignore
    return alternatives.map((alt, index) => ({
      id: alt.id || `a${index + 1}`,
      text: alt.text,
      isCorrect: alt.isCorrect
    }));
  }
}
