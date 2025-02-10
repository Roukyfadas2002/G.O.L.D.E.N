import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

interface MenuItem {
  label: string;
  icon: string;
  path: string;
  roles: string[]; // Rôles autorisés (ex: ['User', 'Admin'])
}

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule, LoginDialogComponent]
})
export class HeaderComponent {
  activePage: string = 'home';
  isAuthenticated: boolean = false;
  userRole: string = 'Guest';

  menuItems: MenuItem[] = [
    { label: 'Accueil', icon: 'fas fa-home', path: '/', roles: ['Guest', 'User', 'Admin'] },
    { label: 'À propos', icon: 'fas fa-info-circle', path: '/about', roles: ['Guest', 'User', 'Admin'] },
    { label: 'Réservation', icon: 'fas fa-bed', path: '/reservation', roles: ['User', 'Admin'] },
    { label: 'Adoption', icon: 'fas fa-paw', path: '/adoption', roles: ['User', 'Admin'] },
    { label: 'Produits', icon: 'fas fa-shopping-cart', path: '/commande', roles: ['User', 'Admin'] },
    { label: 'Gestion Clients', icon: 'fas fa-user-shield', path: '/admin/clients', roles: ['Admin'] },
    { label: 'Gestion Chiens', icon: 'fas fa-dog', path: '/admin/chiens', roles: ['Admin'] },
    { label: 'Gestion Chambres', icon: 'fas fa-hotel', path: '/admin/chambres', roles: ['Admin'] }
  ];

  constructor(private router: Router, private authService: AuthService) {
    this.updateAuthState();
    this.listenForAuthChanges();
  }

  private updateAuthState(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userRole = this.authService.getRole() || 'Guest';
  }

  private listenForAuthChanges(): void {
    window.addEventListener('storage', () => {
      this.updateAuthState();
    });
  }

  /**
   * ✅ Naviguer vers une page
   */
  navigateTo(path: string): void {
    this.activePage = path;
    this.router.navigate([path]);
  }

  /**
   * ✅ Vérifier si le menu doit être affiché selon le rôle
   */
  isMenuItemVisible(menuItem: MenuItem): boolean {
    return menuItem.roles.includes(this.userRole);
  }

  login(username: string, password: string): void {
    if (this.authService.login(username, password)) {
      this.updateAuthState();
      this.router.navigate(['/']);
    } else {
      alert("Échec de connexion : identifiants incorrects.");
    }
  }

  logout(): void {
    this.authService.logout();
    this.updateAuthState();
    this.router.navigate(['/']);
  }

  openLoginDialog(): void {
    const loginDialog = document.getElementById('loginDialog');
    if (loginDialog) loginDialog.style.display = 'flex';
  }

  closeLoginDialog(): void {
    const loginDialog = document.getElementById('loginDialog');
    if (loginDialog) loginDialog.style.display = 'none';
  }
}
