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

  constructor(private api: ProfileApiService, private router: Router) {}

  submit() {
    this.error = null;
    const user = new User({
      name: this.name,
      email: this.email,
      password: this.password,
      rol: this.rol === 'creador' || this.rol === 'aprendiz' ? this.rol : undefined
    });
    if (!user.isValidForRegistration()) {
      this.error = 'Completa todos los campos correctamente.';
      return;
    }
    this.api.create(user).subscribe({
      next: created => {
        if (created) {
          localStorage.setItem('currentUser', JSON.stringify(created));
          this.router.navigate(['/profile']);
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
