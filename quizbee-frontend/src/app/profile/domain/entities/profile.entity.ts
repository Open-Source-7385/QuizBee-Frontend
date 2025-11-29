import { BaseEntity } from '../../../shared/infrastructure/base-entity';

/**
 * User statistics for tracking quiz performance
 */
export interface UserStats {
  lives: number;
  points: number;
  quizzesPlayed: number;
  quizzesWon: number;
  quizzesLost: number;
  currentStreak: number;
}

/**
 * User role type
 */
export type UserRole = 'creador' | 'aprendiz' | 'admin' | 'moderator';

/**
 * Subscription status type
 */
export type SubscriptionStatus = 'active' | 'free' | 'cancelled';

/**
 * Represents a user profile entity in the domain.
 * This is the main aggregate root for the Profile bounded context.
 */
export interface Profile extends BaseEntity {
  id: number;
  name: string;
  email: string;
  password?: string; // Optional for security - should not always be exposed
  avatar?: string;
  role?: UserRole;
  displayName?: string;
  bio?: string;
  country?: string;
  language: string;
  languages?: string[];
  level: string;
  stats?: UserStats;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiry?: Date;
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

/**
 * Factory function to create a Profile with default values
 */
export function createProfile(data: Partial<Profile>): Profile {
  const now = new Date();
  return {
    id: data.id || 0,
    name: data.name || '',
    email: data.email || '',
    password: data.password,
    avatar: data.avatar || '👤',
    role: data.role,
    displayName: data.displayName || data.name,
    bio: data.bio || '',
    country: data.country || '',
    language: data.language || Language.ENGLISH,
    languages: data.languages || [],
    level: data.level || UserLevel.NOVATO,
    stats: data.stats || {
      lives: 5,
      points: 0,
      quizzesPlayed: 0,
      quizzesWon: 0,
      quizzesLost: 0,
      currentStreak: 0
    },
    subscriptionStatus: data.subscriptionStatus || 'free',
    subscriptionExpiry: data.subscriptionExpiry,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}

/**
 * Validates if a profile has the minimum required data for registration
 */
export function isValidForRegistration(profile: Partial<Profile>): boolean {
  return (
    !!profile.name && profile.name.length > 0 &&
    !!profile.email && profile.email.length > 0 &&
    !!profile.password && profile.password.length >= 6 &&
    (!profile.role || profile.role === 'creador' || profile.role === 'aprendiz')
  );
}