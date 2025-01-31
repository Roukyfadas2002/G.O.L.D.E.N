import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [CommonModule]
})
export class FooterComponent {
  isAuthenticated: boolean = false;
  userRole: string = 'Guest';
  username: string = 'Invité';

  constructor(private authService: AuthService) {
    this.updateAuthState();
    this.listenForAuthChanges();
  }

  /**
   * Met à jour l'état d'authentification
   */
  private updateAuthState(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getRole() || 'Guest';
    this.username = this.authService.getUsername() || 'Invité';
  }

  /**
   * Écoute les changements d'authentification pour mettre à jour le footer dynamiquement
   */
  private listenForAuthChanges(): void {
    window.addEventListener('storage', () => {
      this.updateAuthState();
    });
  }
}
