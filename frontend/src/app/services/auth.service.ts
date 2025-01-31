import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private TOKEN_EXPIRATION_MINUTES = 1; // ✅ Facilement modifiable (10 minutes par défaut)
  private WARNING_TIME_BEFORE_EXPIRATION = 30 * 1000; // ✅ Avertissement 30s avant expiration

  private users = {
    admin: { username: 'admin', password: 'admin123', role: 'Admin' },
    user: { username: 'user', password: 'user123', role: 'User' }
  };

  private warningTimeout: any;
  private logoutTimeout: any;

  constructor() {
    this.checkTokenExpiration(); // ✅ Vérifie si le token a expiré dès le chargement
  }

  /**
   * Connexion de l'utilisateur
   */
  login(username: string, password: string): boolean {
    const user = this.users[username as keyof typeof this.users];

    if (user && user.password === password) {
      const token = this.generateToken(user.role);
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('username', user.username); // ✅ Stocke le nom d'utilisateur

      this.scheduleAutoLogout(); // ✅ Planifie la déconnexion automatique
      return true;
    }
    return false;
  }

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username'); // ✅ Supprime aussi le nom d'utilisateur
    clearTimeout(this.warningTimeout);
    clearTimeout(this.logoutTimeout);
    window.location.reload(); // ✅ Rafraîchir pour réinitialiser l'état
  }

  /**
   * Retourne le rôle de l'utilisateur
   */
  getRole(): string {
    return localStorage.getItem('role') || 'Guest';
  }

  /**
   * Retourne le nom de l'utilisateur connecté
   */
  getUsername(): string {
    return localStorage.getItem('username') || 'Invité';
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp < Date.now() / 1000) {
      this.logout(); // ✅ Expiration détectée → Déconnexion immédiate
      return false;
    }
    return true;
  }

  /**
   * Génère un token JWT simulé avec une durée d'expiration
   */
  private generateToken(role: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      role: role,
      exp: Math.floor(Date.now() / 1000) + (this.TOKEN_EXPIRATION_MINUTES * 60) // ✅ Converti en secondes
    };

    const base64Encode = (obj: any) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
    return `${base64Encode(header)}.${base64Encode(payload)}.signature`;
  }

  /**
   * Vérifie si le token est encore valide au démarrage
   */
  private checkTokenExpiration(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = (payload.exp * 1000) - Date.now();

    if (expiresIn <= 0) {
      this.logout(); // ✅ Déconnexion immédiate si le token est déjà expiré
    } else {
      this.scheduleAutoLogout();
    }
  }

  /**
   * Planifie la déconnexion automatique et l'avertissement
   */
  private scheduleAutoLogout(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = (payload.exp * 1000) - Date.now();

    if (expiresIn > this.WARNING_TIME_BEFORE_EXPIRATION) {
      this.warningTimeout = setTimeout(() => {
        this.showLogoutWarning();
      }, expiresIn - this.WARNING_TIME_BEFORE_EXPIRATION);
    }

    this.logoutTimeout = setTimeout(() => {
      this.logout(); // ✅ Déconnecte l'utilisateur après expiration
    }, expiresIn);
  }

  /**
   * Affiche la pop-up d'avertissement avant la déconnexion
   */
  private showLogoutWarning(): void {
    const logoutWarning = document.getElementById('logoutWarning');
    if (logoutWarning) logoutWarning.style.display = 'flex';
  }

  /**
   * Prolonge la session de l'utilisateur
   */
  extendSession(): void {
    const role = this.getRole();
    const username = this.getUsername();
    if (role === 'Guest') return; // ✅ Si l'utilisateur est déconnecté, ne rien faire
  
    // ✅ Générer un nouveau token avec une nouvelle expiration
    const newToken = this.generateToken(role);
    localStorage.setItem('token', newToken);

    // ✅ Conserver le rôle et le nom d'utilisateur
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);
  
    // ✅ Cacher la pop-up d'avertissement
    const logoutWarning = document.getElementById('logoutWarning');
    if (logoutWarning) logoutWarning.style.display = 'none';
  
    // ✅ Annuler les anciens timers et reprogrammer la déconnexion automatique
    clearTimeout(this.warningTimeout);
    clearTimeout(this.logoutTimeout);
    this.scheduleAutoLogout();
  }
}
