import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule, LoginDialogComponent] // ✅ Ajout correct
})
export class HeaderComponent {
  activePage: string = 'home';
  isAuthenticated: boolean = false;
  userRole: string = 'Guest';

  constructor(private router: Router, private authService: AuthService) {
    this.updateAuthState();
    this.listenForAuthChanges();
  }

  /**
   * Met à jour l'état d'authentification et le rôle utilisateur
   */
  private updateAuthState(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getRole() || 'Guest';
  }

  /**
   * Écoute les changements d'authentification pour mise à jour automatique
   */
  private listenForAuthChanges(): void {
    window.addEventListener('storage', () => {
      this.updateAuthState();
    });
  }

  /**
   * Définit la page active
   */
  setActivePage(page: string): void {
    this.activePage = page;
  }

  /**
   * Connexion (via LoginDialog)
   */
  login(username: string, password: string): void {
    if (this.authService.login(username, password)) {
      this.updateAuthState();
      this.router.navigate(['/']); // ✅ Redirection vers l'accueil après connexion
    } else {
      alert("Échec de connexion : identifiants incorrects.");
    }
  }

  /**
   * Déconnexion + redirection
   */
  logout(): void {
    this.authService.logout();
    this.updateAuthState();
    this.router.navigate(['/']); // ✅ Redirection vers l'accueil après déconnexion
  }

  /**
   * Vérifie si l'utilisateur a accès à une page donnée
   */
  isPageAccessible(page: string): boolean {
    if (this.userRole === 'Guest') {
      return page === 'home' || page === 'about';
    }
    return true;
  }

  /**
   * Affiche la boîte de dialogue de connexion
   */
  openLoginDialog(): void {
    const loginDialog = document.getElementById('loginDialog');
    if (loginDialog) loginDialog.style.display = 'flex';
  }

  /**
   * Ferme la boîte de dialogue de connexion
   */
  closeLoginDialog(): void {
    const loginDialog = document.getElementById('loginDialog');
    if (loginDialog) loginDialog.style.display = 'none';
  }
}
