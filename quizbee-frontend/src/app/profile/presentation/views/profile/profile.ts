// ...existing code...
import { Component, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileApiService } from '../../../infrastructure/profile.api';
import { User } from '../../../domain/model/user.entity';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileView {
  clearSession() {
    localStorage.removeItem('currentUser');
    window.location.reload();
  }
  protected user: User | null = null;
  protected loading = true;
  language: string = 'es';
  level: string = 'novato';

  constructor(private api: ProfileApiService, private router: Router, private cdr: ChangeDetectorRef, private translate: TranslateService) {
    this.language = this.translate.currentLang || this.translate.getBrowserLang() || 'es';
    this.translate.use(this.language);
    this.loadProfile();
  }

  onLanguageChange(lang: string) {
    this.language = lang;
    this.translate.use(lang);
  }

  loadProfile() {
    this.loading = true;
    const raw = localStorage.getItem('currentUser');
    let userId = 'creador-1';
    console.log('[Profile] loadProfile: raw localStorage', raw);
    if (raw) {
      try {
        const u = JSON.parse(raw);
        console.log('[Profile] Usuario parseado de localStorage:', u);
        if (u && u.id) {
          userId = u.id;
        }
      } catch (e) {
        console.error('[Profile] Error al leer currentUser:', e);
      }
    }
    console.log('[Profile] Buscando usuario con id:', userId);
    this.api.getById(userId).subscribe({
      next: found => {
        console.log('[Profile] Respuesta de getById:', found);
        if (found && found.id) {
          this.user = found;
        } else {
          this.user = null;
          console.error('[Profile] Usuario no encontrado en backend:', userId);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.user = null;
        this.loading = false;
        console.error('[Profile] No se pudo cargar el usuario:', err);
        this.cdr.detectChanges();
      }
    });
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
