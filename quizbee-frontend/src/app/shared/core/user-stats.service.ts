// quizbee-frontend/src/app/shared/core/user-stats.service.ts
// ✅ VERSIÓN CON PERSISTENCIA EN DB.JSON

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../../profile/domain/model/user.entity';
import { environment } from '../../../environments/environment';

export interface UserStats {
  lives: number;
  points: number;
  quizzesPlayed: number;
  quizzesWon: number;
  quizzesLost: number;
  currentStreak: number;
}

// @ts-ignore
export interface EnhancedUserData extends Omit<User, 'isValidForRegistration'> {
  stats: UserStats;
  subscriptionStatus: 'active' | 'inactive' | 'free';
  currentLanguage: string;
  hasActiveSubscription: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserStatsService {
  private apiUrl = `${environment.platformProviderApiBaseUrl}/users`;
  private statsSubject = new BehaviorSubject<UserStats>(this.getDefaultStats());
  public stats$ = this.statsSubject.asObservable();

  // Signals para UI reactivo
  private livesSignal = signal<number>(5);
  private pointsSignal = signal<number>(0);
  private hasSubscriptionSignal = signal<boolean>(false);

  public lives = computed(() => this.livesSignal());
  public points = computed(() => this.pointsSignal());
  public hasSubscription = computed(() => this.hasSubscriptionSignal());
  public livesDisplay = computed(() =>
    this.hasSubscription() ? '∞' : this.lives().toString()
  );

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.initializeFromDB();
  }

  private getDefaultStats(): UserStats {
    return {
      lives: 5,
      points: 0,
      quizzesPlayed: 0,
      quizzesWon: 0,
      quizzesLost: 0,
      currentStreak: 0
    };
  }

  /**
   * ✅ CARGAR DESDE DB.JSON
   */
  private initializeFromDB(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.http.get<any>(`${this.apiUrl}/${user.id}`).subscribe({
        next: (userData) => {
          const stats = userData.stats || this.getDefaultStats();
          const subscriptionStatus = userData.subscriptionStatus || 'free';

          this.statsSubject.next(stats);
          this.livesSignal.set(stats.lives);
          this.pointsSignal.set(stats.points);
          this.hasSubscriptionSignal.set(subscriptionStatus === 'active');

          console.log('✅ Stats cargados desde DB:', stats);
          console.log('✅ Subscription status:', subscriptionStatus);
        },
        error: (err) => {
          console.error('Error loading user stats:', err);
        }
      });
    }
  }

  /**
   * ✅ GUARDAR EN DB.JSON
   */
  private saveStatsToDatabase(): Observable<any> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return of(null);
    }

    const currentStats = this.statsSubject.value;
    const updateData = {
      stats: currentStats,
      subscriptionStatus: this.hasSubscription() ? 'active' : 'free'
    };

    console.log('💾 Guardando stats en DB:', updateData);

    return this.http.patch(`${this.apiUrl}/${user.id}`, updateData).pipe(
      tap(() => {
        console.log('✅ Stats guardados exitosamente en DB');
      }),
      catchError(err => {
        console.error('❌ Error guardando stats:', err);
        return of(null);
      })
    );
  }

  /**
   * Verifica si el usuario puede jugar un quiz
   */
  canPlayQuiz(): boolean {
    if (this.hasSubscription()) {
      return true;
    }
    return this.lives() > 0;
  }

  /**
   * ✅ PROCESAR RESULTADO DE QUIZ CON PERSISTENCIA
   */
  completeQuiz(correctAnswers: number, totalQuestions: number): Observable<void> {
    return new Observable(observer => {
      const passThreshold = 7;
      const passed = correctAnswers >= passThreshold;

      const currentStats = this.statsSubject.value;
      const newStats = { ...currentStats };

      newStats.quizzesPlayed++;

      if (passed) {
        // ✅ APROBÓ EL QUIZ
        newStats.quizzesWon++;
        newStats.currentStreak++;

        // Calcular puntos
        const basePoints = 100;
        const bonusPoints = correctAnswers * 10;
        const totalPoints = basePoints + bonusPoints;

        newStats.points += totalPoints;
        this.pointsSignal.set(newStats.points);

        console.log(`✅ Quiz aprobado! +${totalPoints} puntos`);
      } else {
        // ❌ REPROBÓ EL QUIZ
        newStats.quizzesLost++;
        newStats.currentStreak = 0;

        // Pierde 1 vida si es usuario FREE
        if (!this.hasSubscription()) {
          newStats.lives = Math.max(0, newStats.lives - 1);
          this.livesSignal.set(newStats.lives);
          console.log(`❌ Quiz reprobado! Perdiste 1 vida. Vidas restantes: ${newStats.lives}`);
        }
      }

      this.statsSubject.next(newStats);

      // ✅ GUARDAR EN DB.JSON
      this.saveStatsToDatabase().subscribe({
        next: () => {
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error('Error saving stats:', err);
          observer.next(); // Continue anyway
          observer.complete();
        }
      });
    });
  }

  /**
   * Pierde una vida manualmente
   */
  loseLife(): Observable<void> {
    if (!this.hasSubscription()) {
      const currentStats = this.statsSubject.value;
      const newLives = Math.max(0, currentStats.lives - 1);

      this.statsSubject.next({ ...currentStats, lives: newLives });
      this.livesSignal.set(newLives);

      return this.saveStatsToDatabase().pipe(map(() => undefined));
    }
    return of(undefined);
  }

  /**
   * Agrega vidas
   */
  addLives(amount: number): Observable<void> {
    if (!this.hasSubscription()) {
      const currentStats = this.statsSubject.value;
      const newLives = Math.min(5, currentStats.lives + amount);

      this.statsSubject.next({ ...currentStats, lives: newLives });
      this.livesSignal.set(newLives);

      return this.saveStatsToDatabase().pipe(map(() => undefined));
    }
    return of(undefined);
  }

  /**
   * Resetea vidas a 5 (diario)
   */
  resetDailyLives(): void {
    if (!this.hasSubscription()) {
      const lastReset = localStorage.getItem('last_lives_reset');
      const today = new Date().toDateString();

      if (lastReset !== today) {
        const currentStats = this.statsSubject.value;
        currentStats.lives = 5;

        this.statsSubject.next(currentStats);
        this.livesSignal.set(5);

        this.saveStatsToDatabase().subscribe(() => {
          localStorage.setItem('last_lives_reset', today);
          console.log('🔄 Vidas reseteadas a 5');
        });
      }
    }
  }

  /**
   * ✅ AGREGAR PUNTOS CON PERSISTENCIA
   */
  addPoints(points: number): Observable<void> {
    const currentStats = this.statsSubject.value;
    const newPoints = currentStats.points + points;

    currentStats.points = newPoints;
    this.statsSubject.next(currentStats);
    this.pointsSignal.set(newPoints);

    console.log(`⭐ +${points} puntos! Total: ${newPoints}`);

    return this.saveStatsToDatabase().pipe(map(() => undefined));
  }

  /**
   * Obtiene datos completos del usuario para UI
   */
  getEnhancedUserData(): EnhancedUserData | null {
    const user = this.authService.getCurrentUser();
    if (!user) return null;

    const { isValidForRegistration, ...userWithoutMethod } = user as any;

    return {
      ...userWithoutMethod,
      stats: this.statsSubject.value,
      subscriptionStatus: this.hasSubscription() ? 'active' : 'free',
      currentLanguage: (user as any).currentLanguage || 'English',
      hasActiveSubscription: this.hasSubscription()
    };
  }

  /**
   * ✅ ACTUALIZAR SUSCRIPCIÓN CON PERSISTENCIA
   */
  updateSubscriptionStatus(hasSubscription: boolean): Observable<void> {
    this.hasSubscriptionSignal.set(hasSubscription);

    const currentStats = this.statsSubject.value;

    if (hasSubscription) {
      // Vidas ilimitadas para premium
      currentStats.lives = 999999;
      this.livesSignal.set(999999);
    } else {
      // Volver a sistema de vidas (máximo 5)
      currentStats.lives = Math.min(5, currentStats.lives);
      this.livesSignal.set(currentStats.lives);
    }

    this.statsSubject.next(currentStats);

    // ✅ GUARDAR EN DB.JSON
    return this.saveStatsToDatabase().pipe(map(() => undefined));
  }

  /**
   * Obtiene stats actuales
   */
  getCurrentStats(): UserStats {
    return this.statsSubject.value;
  }

  /**
   * ✅ RECARGAR DATOS DESDE DB
   */
  reloadFromDatabase(): Observable<void> {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return of(undefined);
    }

    return this.http.get<any>(`${this.apiUrl}/${user.id}`).pipe(
      tap((userData) => {
        const stats = userData.stats || this.getDefaultStats();
        const subscriptionStatus = userData.subscriptionStatus || 'free';

        this.statsSubject.next(stats);
        this.livesSignal.set(stats.lives);
        this.pointsSignal.set(stats.points);
        this.hasSubscriptionSignal.set(subscriptionStatus === 'active');

        console.log('🔄 Stats recargados desde DB');
      }),
      map(() => undefined),
      catchError(err => {
        console.error('Error reloading stats:', err);
        return of(undefined);
      })
    );
  }
}
