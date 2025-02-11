import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule] // ✅ Ajout de ReactiveFormsModule pour formGroup
})
export class LoginDialogComponent {
  loginForm: FormGroup;
  showPassword: boolean = false; // ✅ Correction: initialisation correcte
  errorMessage: string = '';

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * 🔐 Basculer la visibilité du mot de passe
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * 🔐 Gère la connexion de l'utilisateur
   */
  onLogin(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    console.log("👤 Tentative de connexion avec :", email);

    this.authService.login(email, password).subscribe({
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