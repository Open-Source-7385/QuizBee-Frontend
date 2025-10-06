import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileController } from '../../../infrastructure/controllers/profile.controller';
import { Profile, Language, UserLevel } from '../../../domain/entities/profile.entity';

/**
 * Profile Management Component based on the mockup provided
 * This component handles the profile view with all the UI elements shown in the mockup
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  
  // Signals for reactive state management
  protected readonly profile = signal<Profile | null>(null);
  protected readonly isEditing = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly validationErrors = signal<string[]>([]);

  // Form data
  protected formData = {
    name: '',
    email: '',
    password: '',
    language: Language.SPANISH,
    level: UserLevel.NOVATO
  };

  // Available options
  protected readonly languages = Object.values(Language);
  protected readonly levels = Object.values(UserLevel);

  // Mock current user ID (in real app, this would come from auth service)
  private currentUserId = 1;

  constructor(
    private profileController: ProfileController,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    await this.loadProfile();
  }

  /**
   * Load the current user's profile
   */
  async loadProfile() {
    this.isLoading.set(true);
    try {
      const profile = await this.profileController.getProfileById(this.currentUserId);
      if (profile) {
        this.profile.set(profile);
        this.formData = {
          name: profile.name,
          email: profile.email,
          password: '', // Don't show password
          language: profile.language as Language,
          level: profile.level as UserLevel
        };
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      this.showMessage('Error loading profile', true);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Toggle edit mode
   */
  toggleEdit() {
    if (this.isEditing()) {
      // Cancel editing - restore original data
      const currentProfile = this.profile();
      if (currentProfile) {
        this.formData = {
          name: currentProfile.name,
          email: currentProfile.email,
          password: '',
          language: currentProfile.language as Language,
          level: currentProfile.level as UserLevel
        };
      }
    }
    this.isEditing.set(!this.isEditing());
    this.validationErrors.set([]);
  }

  /**
   * Save profile changes
   */
  async saveProfile() {
    this.validationErrors.set([]);
    
    // Validate form data
    const validation = this.profileController.validateProfileData(this.formData);
    if (!validation.isValid) {
      this.validationErrors.set(validation.errors);
      return;
    }

    // Check email availability if email changed
    const currentProfile = this.profile();
    if (currentProfile && this.formData.email !== currentProfile.email) {
      const emailAvailable = await this.profileController.isEmailAvailable(
        this.formData.email, 
        this.currentUserId
      );
      if (!emailAvailable) {
        this.validationErrors.set(['Email is already in use']);
        return;
      }
    }

    this.isLoading.set(true);
    try {
      const updateData: any = {
        name: this.formData.name,
        email: this.formData.email,
        language: this.formData.language,
        level: this.formData.level
      };

      // Only include password if it was changed
      if (this.formData.password.trim()) {
        updateData.password = this.formData.password;
      }

      const updatedProfile = await this.profileController.updateProfile(
        this.currentUserId,
        updateData
      );

      this.profile.set(updatedProfile);
      this.isEditing.set(false);
      this.formData.password = ''; // Clear password field
      this.showMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      this.showMessage('Error updating profile', true);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Close session (logout)
   */
  closeSession() {
    // In a real app, this would call an auth service
    if (confirm('Are you sure you want to close your session?')) {
      this.showMessage('Session closed');
      // Redirect to login or home
    }
  }

  /**
   * Delete account
   */
  async deleteAccount() {
    const confirmMessage = 'Are you sure you want to delete your account? This action cannot be undone.';
    if (confirm(confirmMessage)) {
      this.isLoading.set(true);
      try {
        const success = await this.profileController.deleteProfile(this.currentUserId);
        if (success) {
          this.showMessage('Account deleted successfully');
          // Redirect to home or login
        } else {
          this.showMessage('Error deleting account', true);
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        this.showMessage('Error deleting account', true);
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  /**
   * Show message to user
   */
  private showMessage(message: string, isError = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}