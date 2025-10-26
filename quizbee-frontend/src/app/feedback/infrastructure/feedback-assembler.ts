import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Feedback} from '../domain/model/feedback.entity';
import {FeedbackResponse} from '../domain/model/feedback-response.entity';
import {FeedbacksResponse, FeedbackResource, FeedbackResponsesResponse, FeedbackResponseResource} from './feedback-response';

export class FeedbackAssembler implements BaseAssembler<Feedback, FeedbackResource, FeedbacksResponse> {

  toEntitiesFromResponse(response: FeedbacksResponse): Feedback[] {
    return response.feedbacks.map(resource => this.toEntityFromResource(resource as FeedbackResource));
  }

  toEntityFromResource(resource: FeedbackResource): Feedback {
    return new Feedback({
      id: resource.id,
      quizId: resource.quizId,
      userId: resource.userId,
      rating: resource.rating,
      comment: resource.comment,
      createdAt: new Date(resource.createdAt)
    });
  }

  toResourceFromEntity(entity: Feedback): FeedbackResource {
    return {
      id: entity.id,
      quizId: entity.quizId,
      userId: entity.userId,
      rating: entity.rating,
      comment: entity.comment,
      createdAt: entity.createdAt.toISOString()
    } as FeedbackResource;
  }

  // Methods for FeedbackResponse
  toResponseEntitiesFromResponse(response: FeedbackResponsesResponse): FeedbackResponse[] {
    return response.responses.map(resource => this.toResponseEntityFromResource(resource as FeedbackResponseResource));
  }

  toResponseEntityFromResource(resource: FeedbackResponseResource): FeedbackResponse {
    return new FeedbackResponse({
      id: resource.id,
      feedbackId: resource.feedbackId,
      creatorId: resource.creatorId,
      response: resource.response,
      createdAt: new Date(resource.createdAt)
    });
  }

  toResponseResourceFromEntity(entity: FeedbackResponse): FeedbackResponseResource {
    return {
      id: entity.id,
      feedbackId: entity.feedbackId,
      creatorId: entity.creatorId,
      response: entity.response,
      createdAt: entity.createdAt.toISOString()
    } as FeedbackResponseResource;
  }
}
