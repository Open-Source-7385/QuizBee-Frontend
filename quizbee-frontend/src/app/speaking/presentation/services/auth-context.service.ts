import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User,UserRole } from '../../domain/model/user.entity';


@Injectable({
  providedIn: 'root'
})
export class AuthContextService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Mock user - en una app real esto vendría del servicio de autenticación
    this.setCurrentUser({
      id: 'student1',
      name: 'Juan Pérez',
      email: 'juan@student.com',
      role: UserRole.STUDENT
    });
  }

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isTeacher(): boolean {
    return this.currentUserSubject.value?.role === UserRole.TEACHER;
  }

  isStudent(): boolean {
    return this.currentUserSubject.value?.role === UserRole.STUDENT;
  }
}
