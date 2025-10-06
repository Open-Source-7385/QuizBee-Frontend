import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Simple Profile Component for testing
 */
@Component({
  selector: 'app-profile-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; text-align: center;">
      <h1>🎯 Profile Component Working!</h1>
      <p>This is the Profile page - component is loading correctly!</p>
      <div style="background: #4db6ac; color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h2>Profile Test Success ✅</h2>
        <p>The routing and component loading is working perfectly!</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    }
  `]
})
export class ProfileTestComponent {}