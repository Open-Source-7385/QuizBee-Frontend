// ...existing code...
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileApiService } from '../../../infrastructure/endpoints/profile-api.service';
import { Profile } from '../../../domain/entities/profile.entity';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileView implements OnInit {
  clearSession() {
    localStorage.removeItem('currentUser');
    window.location.reload();
  }
  protected user: Profile | null = null;
  protected sessionUser: any = null;
  protected loading = true;
  language: string = 'es';
  level: string = 'novato';

  constructor(private api: ProfileApiService, private router: Router, private cdr: ChangeDetectorRef, private translate: TranslateService) {
    this.language = this.translate.currentLang || this.translate.getBrowserLang() || 'es';
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.loadProfile();
  }

  onLanguageChange(lang: string) {
    this.language = lang;
    this.translate.use(lang);
  }

  loadProfile() {
    this.loading = true;
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      try {
        this.sessionUser = JSON.parse(raw);
        console.log('[Profile] Usuario de sesión:', this.sessionUser);
      } catch (e) {
        console.error('[Profile] Error al leer currentUser:', e);
        this.sessionUser = null;
      }
    } else {
      this.sessionUser = null;
    }
    // Si quieres seguir mostrando datos del backend, puedes mantener la lógica anterior aquí
    // Pero para mostrar solo los datos de sesión, no es necesario llamar al backend
  this.loading = false;
  }

  reloadProfile() {
    this.loadProfile();
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    // Aquí podrías agregar lógica para eliminar el usuario en el backend
    alert('Cuenta eliminada (demo)');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }
}
