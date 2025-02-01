import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Ajout pour corriger *ngIf et ngModel

})
export class LoginDialogComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  /**
   * 🔐 Gère la connexion de l'utilisateur
   */
  onLogin(): void {
    console.log("👤 Tentative de connexion avec :", this.email);

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success) {
          console.log("🎉 Connexion réussie !");
          window.location.reload();
        } else {
          this.errorMessage = "❌ Email ou mot de passe incorrect.";
        }
      },
      error: (err) => {
        console.error("🚨 Erreur de connexion :", err);
        this.errorMessage = "🚨 Problème de connexion au serveur.";
      }
    });
  }
}
