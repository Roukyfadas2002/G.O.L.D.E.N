import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout-warning',
  standalone: true,
  templateUrl: './logout-warning.component.html',
  styleUrls: ['./logout-warning.component.css']
})
export class LogoutWarningComponent {
  constructor(private authService: AuthService) {}

  extendSession() {
    this.authService.extendSession();
  }
}
