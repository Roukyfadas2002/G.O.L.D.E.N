import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ReservationComponent } from './components/reservation/reservation.component';
import { AdoptionComponent } from './components/adoption/adoption.component';
import { CommandeComponent } from './components/commande/commande.component';
import { ClientsComponent } from './components/clients/clients.component'; // ✅ Page Admin
import { ChienListComponent } from './components/chien-list/chien-list.component'; // ✅ Page Admin (Gestion des Chiens)
import { AuthGuard } from './guards/auth.guard'; // ✅ Protection des routes

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'adoption', component: AdoptionComponent },
  { path: 'commande', component: CommandeComponent },

  // ✅ Routes Admin protégées
  { path: 'admin/clients', component: ClientsComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },
  { path: 'admin/chiens', component: ChienListComponent, canActivate: [AuthGuard], data: { roles: ['Admin'] } },

  { path: '**', redirectTo: '' } // Redirection si la route n'existe pas
];
