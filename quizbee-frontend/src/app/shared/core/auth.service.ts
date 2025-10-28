import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProfileApiService } from '../../profile/infrastructure/profile.api';
import { User } from '../../profile/domain/model/user.entity';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ProfileApiService) {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.currentUserSubject.next(parsed);
      } catch {
        this.currentUserSubject.next(null);
      }
    }
  }

  /**
   * Attempts login and updates current user on success.
   */
  login(email: string, password: string, rol?: 'creador' | 'aprendiz'): Observable<User | null> {
    return this.api.login(email, password, rol).pipe(
      tap(user => {
        if (user) {
          // store raw user for dev only
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
