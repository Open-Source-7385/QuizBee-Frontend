import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth.service';
import { Observable } from 'rxjs';
interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  onlyFor?: 'creador';
}
@Component({
  selector: 'app-sidebar-content',
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar-content.html',
  styleUrl: './sidebar-content.css'
})

export class SidebarContentComponent {
  private allMenuItems: SidebarItem[] = [
    { label: 'SIDEBAR.PROFILE', icon: '👤', route: '/profile' },
    { label: 'SIDEBAR.HOME', icon: '🏠', route: '/home' },
    { label: 'SIDEBAR.CREATE', icon: '➕', route: '/quizz/create', onlyFor: 'creador' },
    { label: 'SIDEBAR.MY_CREATIONS', icon: '📂', route: '/creaciones', onlyFor: 'creador' },
    { label: 'SIDEBAR.QUIZZ', icon: '🚀', route: '/quizz' },
    { label: 'SIDEBAR.RANKING', icon: '📊', route: '/ranking' },
    { label: 'SIDEBAR.HISTORY', icon: '🕑', route: '/historial' },
    { label: 'SIDEBAR.SPEAKING_ROOM', icon: '🎤', route: '/speaking-room' }

  ];
  menuItems: SidebarItem[] = [];
  protected currentUser$: Observable<any>;
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.currentUser$ = this.auth.currentUser$;
    this.currentUser$.subscribe(user => {
      if (user && user.rol === 'aprendiz') {
        this.menuItems = this.allMenuItems.filter(item => !('onlyFor' in item));
      } else {
        this.menuItems = this.allMenuItems;
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
