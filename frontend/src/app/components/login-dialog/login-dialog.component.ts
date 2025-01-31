import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Ajout pour corriger *ngIf et ngModel
})
export class LoginDialogComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  login() {
    if (this.authService.login(this.username, this.password)) {
      window.location.reload(); // Rafraîchir pour appliquer les changements
    } else {
      this.errorMessage = 'Identifiants incorrects !';
    }
  }
}
