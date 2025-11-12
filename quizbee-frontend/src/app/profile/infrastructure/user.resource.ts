export interface UserResource {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  rol?: 'creador' | 'aprendiz';
  displayName?: string;
  bio?: string;
  country?: string;
  languages?: string[];
  currentLanguage?: string;
  subscriptionStatus?: 'active' | 'free' | 'cancelled';
  stats?: {
    lives: number;
    points: number;
    quizzesPlayed: number;
    quizzesWon: number;
    quizzesLost: number;
    currentStreak: number;
  };
}
