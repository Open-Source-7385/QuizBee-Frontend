  import { Component , signal, computed, OnInit, inject} from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Router } from '@angular/router';
  import { AuthService } from '../../../core/auth.service';
  import { UserStatsService } from '../../../core/user-stats.service';
@Component({
  selector: 'app-user-stats-header',
  imports: [CommonModule],
  templateUrl: './user-stats-header.html',
  styleUrl: './user-stats-header.css'
})
export class UserStatsHeader implements OnInit {

  private authService = inject(AuthService);
  private userStatsService = inject(UserStatsService);
  private router = inject(Router);

  // Signals
  currentUser = computed(() => this.authService.getCurrentUser());
  lives = this.userStatsService.lives;
  points = this.userStatsService.points;
  hasSubscription = this.userStatsService.hasSubscription;
  livesDisplay = this.userStatsService.livesDisplay;
  showNoLivesModal = signal(false);

  currentLanguage = computed(() => {
    // TODO: Obtener del perfil del usuario
    return 'English';
  });

  ngOnInit(): void {
    // Resetear vidas diarias si es necesario
    this.userStatsService.resetDailyLives();
  }

  onLivesClick(): void {
    if (!this.hasSubscription() && this.lives() === 0) {
      this.showNoLivesModal.set(true);
    } else if (!this.hasSubscription()) {
      alert(`Te quedan ${this.lives()} vidas. ¡Mejora a Premium para vidas ilimitadas!`);
    }
  }

  goToPremium(): void {
    this.router.navigate(['/plans']);
  }

  closeNoLivesModal(): void {
    this.showNoLivesModal.set(false);
  }

  parseInt(value: string): number {
    return parseInt(value, 10);
  }
}
