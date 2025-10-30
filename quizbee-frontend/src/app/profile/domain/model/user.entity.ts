// quizbee-frontend/src/app/profile/domain/model/user.entity.ts

export interface UserStats {
  lives: number;
  points: number;
  quizzesPlayed: number;
  quizzesWon: number;
  quizzesLost: number;
  currentStreak: number;
}

export class User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  rol?: 'creador' | 'aprendiz';

  // ✅ CAMPOS NUEVOS
  stats?: UserStats;
  subscriptionStatus?: 'active' | 'free' | 'cancelled';
  currentLanguage?: string;
  subscriptionExpiry?: string;

  constructor(data: Partial<User> = {}) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.email = data.email || '';
    this.avatar = data.avatar || '👤';
    this.password = data.password || '';
    this.rol = data.rol as 'creador' | 'aprendiz' || undefined;

    // ✅ Inicializar campos nuevos
    this.stats = data.stats || {
      lives: 5,
      points: 0,
      quizzesPlayed: 0,
      quizzesWon: 0,
      quizzesLost: 0,
      currentStreak: 0
    };
    this.subscriptionStatus = data.subscriptionStatus || 'free';
    this.currentLanguage = data.currentLanguage || 'English';
    this.subscriptionExpiry = data.subscriptionExpiry;
  }

  isValidForRegistration(): boolean {
    return (
      this.name.length > 0 &&
      this.email.length > 0 &&
      typeof this.password === 'string' &&
      this.password.length > 5 &&
      (this.rol === 'creador' || this.rol === 'aprendiz')
    );
  }
}
