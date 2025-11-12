import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileApiService } from '../../../infrastructure/profile.api';
import { User } from '../../../domain/model/user.entity';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected name = '';
  protected email = '';
  protected password = '';
  protected rol: 'creador' | 'aprendiz' | '' = '';
  protected error: string | null = null;

    protected country = '';
    protected currentLanguage = 'English';
    protected avatarUrl: string | null = null;
    protected subscriptionStatus: 'active' | 'free' | 'cancelled' = 'free';
  constructor(private api: ProfileApiService, private router: Router) {}

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  submit() {
    this.error = null;
    const user = new User({
      name: this.name,
      email: this.email,
      password: this.password,
      rol: this.rol === 'creador' || this.rol === 'aprendiz' ? this.rol : undefined,
      country: this.country,
      currentLanguage: this.currentLanguage,
      avatar: this.avatarUrl || undefined,
      subscriptionStatus: this.subscriptionStatus,
      stats: {
        lives: 5,
        points: 0,
        quizzesPlayed: 0,
        quizzesWon: 0,
        quizzesLost: 0,
        currentStreak: 0
      }
    });
    if (!user.isValidForRegistration()) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }
    this.api.create(user).subscribe({
      next: created => {
        if (created && created.id) {
          localStorage.setItem('currentUser', JSON.stringify(created));
          // Navegar al perfil y forzar recarga para mostrar el usuario correcto
          this.router.navigate(['/profile']).then(() => {
            window.location.reload();
          });
        } else {
          this.error = 'No se pudo registrar el usuario.';
        }
      },
      error: err => {
        this.error = err.message || 'Error en el registro';
      }
    });
  }
}
