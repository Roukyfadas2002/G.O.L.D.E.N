import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import nécessaire pour *ngFor
import { ChambreService, Chambre } from '../../services/chambre.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  imports: [CommonModule] // ✅ Ajout de CommonModule pour utiliser *ngFor
})
export class ReservationComponent implements OnInit {
  chambres: Chambre[] = [];

  constructor(private chambreService: ChambreService) {}

  ngOnInit(): void {
    this.fetchChambres();
  }

  /**
   * ✅ Récupère les chambres depuis le backend
   */
  fetchChambres(): void {
    this.chambreService.getChambres().subscribe({
      next: (data) => {
        console.log("🏨 Chambres reçues:", data);
        this.chambres = data;
      },
      error: (error) => {
        console.error("❌ Erreur lors de la récupération des chambres:", error);
      }
    });
  }

  /**
   * ✅ Action de réservation d'une chambre
   */
  reserverChambre(chambre: Chambre): void {
    console.log("🛏️ Réservation demandée:", chambre);
    alert(`✅ Réservation confirmée pour ${chambre.nom}`);
  }
}
