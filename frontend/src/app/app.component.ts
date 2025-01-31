import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LogoutWarningComponent } from './components/logout-warning/logout-warning.component'; // ✅ Import correct

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, LogoutWarningComponent] // ✅ Ajout ici
})
export class AppComponent {}
