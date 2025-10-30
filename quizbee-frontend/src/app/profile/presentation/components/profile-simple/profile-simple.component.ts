import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Simplified Profile Component 
 */
@Component({
  selector: 'app-profile-simple',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <!-- Profile Component Template based on the mockup -->
    <div class="profile-container">
      
      <!-- Left Sidebar Navigation -->
      <aside class="sidebar">
        <div class="logo">
          <mat-icon class="logo-icon">quiz</mat-icon>
        </div>
        
        <nav class="nav-menu">
          <a href="#" class="nav-item active">
            <mat-icon>person</mat-icon>
            <span>Perfil</span>
          </a>
          <a href="#" class="nav-item">
            <mat-icon>add_circle</mat-icon>
            <span>Crear</span>
          </a>
          <a href="#" class="nav-item">
            <mat-icon>folder</mat-icon>
            <span>Mis creaciones</span>
          </a>
          <a href="#" class="nav-item">
            <mat-icon>rocket_launch</mat-icon>
            <span>Jugar</span>
          </a>
          <a href="#" class="nav-item">
            <mat-icon>leaderboard</mat-icon>
            <span>Ranking</span>
          </a>
          <a href="#" class="nav-item">
            <mat-icon>history</mat-icon>
            <span>Historial</span>
          </a>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        
        <!-- Header with menu toggle -->
        <header class="header">
          <button mat-icon-button class="menu-toggle">
            <mat-icon>menu</mat-icon>
          </button>
        </header>

        <!-- Profile Card -->
        <div class="profile-card-container">
          <mat-card class="profile-card">
            
            <!-- Profile Avatar -->
            <div class="profile-avatar">
              <div class="avatar-circle">
                <mat-icon class="avatar-icon">person</mat-icon>
              </div>
            </div>

            <!-- Profile Form -->
            <div class="profile-form">
              
              <!-- Name Field -->
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Nombre:</mat-label>
                <input 
                  matInput 
                  [(ngModel)]="formData.name"
                  [readonly]="!isEditing()"
                  placeholder="Juan Pérez">
                <mat-icon matSuffix *ngIf="isEditing()">edit</mat-icon>
              </mat-form-field>

              <!-- Email Field -->
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>E-mail:</mat-label>
                <input 
                  matInput 
                  type="email"
                  [(ngModel)]="formData.email"
                  [readonly]="!isEditing()"
                  placeholder="juan.perez@email.com">
                <mat-icon matSuffix *ngIf="isEditing()">edit</mat-icon>
              </mat-form-field>

              <!-- Password Field -->
              <mat-form-field appearance="outline" class="form-field" *ngIf="isEditing()">
                <mat-label>Contraseña:</mat-label>
                <input 
                  matInput 
                  type="password"
                  [(ngModel)]="formData.password"
                  placeholder="Nueva contraseña">
                <mat-icon matSuffix>edit</mat-icon>
              </mat-form-field>

              <!-- Language and Level Row -->
              <div class="form-row">
                <!-- Language Select -->
                <mat-form-field appearance="outline" class="form-field-half">
                  <mat-label>Idioma:</mat-label>
                  <mat-select 
                    [(ngModel)]="formData.language"
                    [disabled]="!isEditing()">
                    <mat-option value="Español">Español</mat-option>
                    <mat-option value="English">English</mat-option>
                  </mat-select>
                </mat-form-field>

                <!-- Level Select -->
                <mat-form-field appearance="outline" class="form-field-half">
                  <mat-label>Nivel:</mat-label>
                  <mat-select 
                    [(ngModel)]="formData.level"
                    [disabled]="!isEditing()">
                    <mat-option value="Novato">Novato</mat-option>
                    <mat-option value="Intermedio">Intermedio</mat-option>
                    <mat-option value="Avanzado">Avanzado</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                
                <!-- Edit/Save/Cancel Buttons -->
                <div class="edit-buttons">
                  <button 
                    *ngIf="!isEditing()" 
                    mat-raised-button 
                    color="primary" 
                    (click)="toggleEdit()">
                    <mat-icon>edit</mat-icon>
                    Edit Profile
                  </button>
                  
                  <button 
                    *ngIf="isEditing()" 
                    mat-raised-button 
                    color="primary" 
                    (click)="saveProfile()">
                    <mat-icon>save</mat-icon>
                    Save Changes
                  </button>
                  
                  <button 
                    *ngIf="isEditing()" 
                    mat-stroked-button 
                    (click)="toggleEdit()">
                    <mat-icon>cancel</mat-icon>
                    Cancel
                  </button>
                </div>

                <!-- Session and Account Buttons -->
                <div class="session-buttons">
                  <button 
                    mat-raised-button 
                    color="accent" 
                    (click)="closeSession()"
                    class="session-btn">
                    Cerrar sesión
                  </button>
                  
                  <button 
                    mat-raised-button 
                    color="warn" 
                    (click)="deleteAccount()"
                    class="delete-btn">
                    Eliminar cuenta
                  </button>
                </div>
              </div>
            </div>
          </mat-card>
        </div>
      </main>
    </div>
  `,
  styles: [`
    /* Profile Component Styles based on the mockup */
    .profile-container {
      display: flex;
      height: 100vh;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    }

    /* Sidebar Styles */
    .sidebar {
      width: 240px;
      background: #81d4fa;
      padding: 20px 0;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .logo {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    .logo-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #0277bd;
    }

    .nav-menu {
      display: flex;
      flex-direction: column;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      color: #0277bd;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s ease;
      border-left: 4px solid transparent;
    }

    .nav-item:hover, .nav-item.active {
      background: rgba(2, 119, 189, 0.1);
      border-left-color: #0277bd;
    }

    .nav-item mat-icon {
      margin-right: 12px;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .header {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
    }

    .menu-toggle {
      display: none;
    }

    /* Profile Card Container */
    .profile-card-container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 20px;
      overflow-y: auto;
    }

    .profile-card {
      width: 100%;
      max-width: 500px;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      background: white;
    }

    /* Profile Avatar */
    .profile-avatar {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
    }

    .avatar-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #4db6ac;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(77, 182, 172, 0.3);
    }

    .avatar-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
      color: white;
    }

    /* Form Styles */
    .profile-form {
      width: 100%;
    }

    .form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .form-field-half {
      flex: 1;
    }

    /* Action Buttons */
    .action-buttons {
      margin-top: 30px;
    }

    .edit-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .edit-buttons button {
      border-radius: 25px;
      padding: 12px 24px;
      font-weight: 500;
    }

    .session-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .session-btn, .delete-btn {
      border-radius: 25px;
      padding: 12px 24px;
      font-weight: 500;
      min-width: 140px;
    }

    .session-btn {
      background: #4db6ac !important;
      color: white !important;
    }

    .delete-btn {
      background: #f44336 !important;
      color: white !important;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .profile-container {
        flex-direction: column;
      }
      
      .sidebar {
        width: 100%;
        height: auto;
        flex-direction: row;
        overflow-x: auto;
        padding: 10px 0;
      }
      
      .nav-menu {
        flex-direction: row;
        padding: 0 10px;
      }
      
      .nav-item {
        white-space: nowrap;
        padding: 10px 15px;
        border-left: none;
        border-bottom: 4px solid transparent;
      }
      
      .nav-item:hover, .nav-item.active {
        border-left: none;
        border-bottom-color: #0277bd;
      }
      
      .profile-card {
        margin: 20px 10px;
        padding: 20px;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      
      .session-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileSimpleComponent implements OnInit {
  
  // Signals for reactive state management
  protected readonly isEditing = signal(false);

  // Form data with mock values
  protected formData = {
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    password: '',
    language: 'Español',
    level: 'Novato'
  };

  ngOnInit() {
    console.log('ProfileSimpleComponent loaded successfully!');
  }

  /**
   * Toggle edit mode
   */
  toggleEdit() {
    this.isEditing.set(!this.isEditing());
  }

  /**
   * Save profile changes
   */
  saveProfile() {
    console.log('Saving profile...', this.formData);
    this.isEditing.set(false);
    alert('Profile saved successfully!');
  }

  /**
   * Close session (logout)
   */
  closeSession() {
    if (confirm('¿Estás seguro que quieres cerrar tu sesión?')) {
      alert('Sesión cerrada');
    }
  }

  /**
   * Delete account
   */
  deleteAccount() {
    const confirmMessage = '¿Estás seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.';
    if (confirm(confirmMessage)) {
      alert('Cuenta eliminada exitosamente');
    }
  }
}