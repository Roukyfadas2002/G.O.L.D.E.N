import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles']; // ✅ Rôles autorisés pour cette route
    const userRole = this.authService.getRole(); // ✅ Récupérer le rôle de l'utilisateur

    if (!this.authService.isAuthenticated() || !expectedRoles.includes(userRole)) {
      this.router.navigate(['/']); // 🔄 Redirection vers la page d'accueil si non autorisé
      return false;
    }

    return true; // ✅ Autoriser l'accès
  }
}
