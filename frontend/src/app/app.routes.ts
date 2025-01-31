import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ReservationComponent } from './pages/reservation/reservation.component';
import { AdoptionComponent } from './pages/adoption/adoption.component';
import { CommandeComponent } from './pages/commande/commande.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'adoption', component: AdoptionComponent },
  { path: 'commande', component: CommandeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirige vers Accueil en cas d'erreur
];
