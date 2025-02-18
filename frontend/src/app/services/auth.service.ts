import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * Interface pour typer la réponse du backend
 */
interface LoginResponse {
  success: boolean;
  message: string;
  role: string;
  username: string;
  clientId: number; // ✅ Ajout de l'ID du client
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login'; // ✅ URL du backend
  private TOKEN_EXPIRATION_MINUTES = 10;
  private WARNING_TIME_BEFORE_EXPIRATION = 30 * 1000;

  private warningTimeout: any;
  private logoutTimeout: any;

  constructor(private http: HttpClient) {
    this.checkTokenExpiration();
  }

  /**
   * 🔐 Envoie une requête de connexion au backend
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response.success) {
          this.storeUserData(response);
          console.log("✅ Connexion réussie ! ID Client stocké :", response.clientId);
          this.scheduleAutoLogout();
        } else {
          console.error("❌ Connexion échouée :", response.message);
        }
      }),
      catchError(error => {
        console.error("❌ Erreur lors de la connexion :", error);
        return throwError(() => new Error(error));
      })
    );
  }

  /**
   * Stocke les informations utilisateur dans le localStorage
   */
  private storeUserData(response: LoginResponse): void {
    const token = this.generateToken(response.role);
    localStorage.setItem('token', token);
    localStorage.setItem('role', response.role);
    localStorage.setItem('username', response.username);
    localStorage.setItem('clientId', response.clientId.toString()); // ✅ Stocke l'ID du client
  
    console.log("🔐 Client connecté : ID =", response.clientId);
  }

  logout(): void {
    console.log("🔒 Déconnexion en cours...");

    const email = localStorage.getItem('username'); // On récupère l'email stocké
    if (!email) {
        console.warn("⚠️ Aucun email trouvé, suppression locale seulement.");
        this.clearSession();
        return;
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('http://localhost:8080/api/auth/logout', { email }, { headers }).subscribe({
        next: () => {
            console.log("✅ Déconnexion réussie côté backend !");
            this.clearSession();
        },
        error: (error) => {
            console.error("❌ Erreur lors de la déconnexion :", error);
            this.clearSession();
        }
    });
}

/**
 * Nettoie la session (localStorage et timers)
 */
private clearSession(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('clientId'); // ✅ Supprime aussi l'ID du client

  clearTimeout(this.warningTimeout);
  clearTimeout(this.logoutTimeout);

  window.location.reload();
}

  /**
   * 🔍 Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = this.getTokenPayload(token);
    if (!payload) return false;

    if (payload.exp < Date.now() / 1000) {
      this.logout();
      return false;
    }
    return true;
  }

  /**
   * 🔑 Génère un token JWT simulé avec une durée d'expiration
   */
  private generateToken(role: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      role: role,
      exp: Math.floor(Date.now() / 1000) + (this.TOKEN_EXPIRATION_MINUTES * 60)
    };

    return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.signature`;
  }

  /**
   * 📦 Extrait le payload du token JWT
   */
  private getTokenPayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  /**
   * ✅ Vérifie si le token est encore valide au démarrage
   */
  private checkTokenExpiration(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = this.getTokenPayload(token);
    if (!payload) return;

    const expiresIn = (payload.exp * 1000) - Date.now();
    if (expiresIn <= 0) {
      this.logout();
    } else {
      this.scheduleAutoLogout();
    }
  }

  /**
   * ✅ Planifie la déconnexion automatique et l'avertissement
   */
  private scheduleAutoLogout(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = this.getTokenPayload(token);
    if (!payload) return;

    const expiresIn = (payload.exp * 1000) - Date.now();

    if (expiresIn > this.WARNING_TIME_BEFORE_EXPIRATION) {
      this.warningTimeout = setTimeout(() => {
        this.showLogoutWarning();
      }, expiresIn - this.WARNING_TIME_BEFORE_EXPIRATION);
    }

    this.logoutTimeout = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  /**
   * ✅ Affiche une alerte avant la déconnexion
   */
  private showLogoutWarning(): void {
    console.warn("⚠️ Votre session va expirer bientôt !");
    const logoutWarning = document.getElementById('logoutWarning');
    if (logoutWarning) logoutWarning.style.display = 'flex';
  }

  /**
   * ✅ Prolonge la session de l'utilisateur
   */
  extendSession(): void {
    const role = this.getRole();
    const username = this.getUsername();
    if (role === 'Guest') return;

    const newToken = this.generateToken(role);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', role);
    localStorage.setItem('username', username);

    const logoutWarning = document.getElementById('logoutWarning');
    if (logoutWarning) logoutWarning.style.display = 'none';

    clearTimeout(this.warningTimeout);
    clearTimeout(this.logoutTimeout);
    this.scheduleAutoLogout();
  }

  /**
   * ✅ Retourne le rôle de l'utilisateur
   */
  getRole(): string {
    return localStorage.getItem('role') || 'Guest';
  }

  /**
   * ✅ Retourne le nom de l'utilisateur connecté
   */
  getUsername(): string {
    return localStorage.getItem('username') || 'Invité';
  }

  getClientId(): number | null {
    const clientId = localStorage.getItem('clientId');
    return clientId ? parseInt(clientId, 10) : null;
  }
}
