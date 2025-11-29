/**
 * User resource representation for API communication
 * This is used for authentication and user-specific operations
 * Note: Does not extend BaseResource because it uses string|number id for compatibility
 */
export interface UserResource {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  rol?: 'creador' | 'aprendiz' | 'admin' | 'moderator';
  displayName?: string;
  bio?: string;
  country?: string;
  languages?: string[];
  currentLanguage?: string;
  subscriptionStatus?: 'active' | 'free' | 'cancelled';
  subscriptionExpiry?: string;
  stats?: {
    lives: number;
    points: number;
    quizzesPlayed: number;
    quizzesWon: number;
    quizzesLost: number;
    currentStreak: number;
  };
}
