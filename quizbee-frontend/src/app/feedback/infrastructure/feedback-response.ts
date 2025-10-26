import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface FeedbacksResponse extends BaseResponse {
  feedbacks: FeedbackResource[];
}

export interface FeedbackResource extends BaseResource {
  id: number;
  quizId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface FeedbackResponsesResponse extends BaseResponse {
  responses: FeedbackResponseResource[];
}

export interface FeedbackResponseResource extends BaseResource {
  id: number;
  feedbackId: number;
  creatorId: number;
  response: string;
  createdAt: string;
}
