import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthContextService } from '../services/auth-context.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherRoleGuard implements CanActivate {

  constructor(
    private authContext: AuthContextService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authContext.isTeacher()) {
      return true;
    } else {
      this.router.navigate(['/learning/speaking']);
      return false;
    }
  }
}
