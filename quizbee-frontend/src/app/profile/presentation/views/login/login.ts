import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../shared/core/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected email = '';
  protected password = '';
  protected rol: 'creador' | 'aprendiz' | '' = '';
  protected error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = null;
    if (!this.rol) {
      this.error = 'Selecciona un rol';
      return;
    }
    this.auth.login(this.email, this.password, this.rol as 'creador' | 'aprendiz').subscribe({
      next: user => {
        if (user) {
          this.router.navigate(['/profile']);
        } else {
          this.error = 'Credenciales incorrectas';
        }
      },
      error: err => {
        this.error = err.message || 'Error en autenticación';
      }
    });
  }
}
