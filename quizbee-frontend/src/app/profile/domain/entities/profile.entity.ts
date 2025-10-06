import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * Represents a user profile entity in the domain.
 */
export interface Profile extends BaseEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  language: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Enum for supported languages
 */
export enum Language {
  SPANISH = 'Español',
  ENGLISH = 'English'
}

/**
 * Enum for user levels
 */
export enum UserLevel {
  NOVATO = 'Novato',
  INTERMEDIO = 'Intermedio',
  AVANZADO = 'Avanzado'
}