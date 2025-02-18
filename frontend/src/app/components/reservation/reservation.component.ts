import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChambreService, Chambre } from '../../services/chambre.service';
import { ReservationService, ReservationRequest } from '../../services/reservation.service';
import { ReservationDialogComponent, ReservationDetails } from '../reservation-dialog/reservation-dialog.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
  imports: [CommonModule, ReservationDialogComponent]
})
export class ReservationComponent implements OnInit {
  chambres: Chambre[] = [];
  showDialog = false;
  selectedChambre?: Chambre;

  constructor(private chambreService: ChambreService, private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.fetchChambres();
  }

  fetchChambres(): void {
    this.chambreService.getChambres().subscribe({
      next: (data) => {
        console.log("🏨 Chambres reçues:", data);
        this.chambres = data;
      },
      error: (error) => {
        console.error("❌ Erreur récupération chambres:", error);
      }
    });
  }

  /**
   * ✅ Afficher le dialogue de réservation
   */
  reserverChambre(chambre: Chambre): void {
    console.log("📡 Ouverture du dialogue pour :", chambre.nom);
    this.selectedChambre = chambre;
    this.showDialog = true;
  }

  /**
   * ✅ Envoyer la réservation au backend
   */
  handleReservation(details: ReservationDetails): void {
    console.log("📡 Envoi de la réservation au backend:", details);

    const reservationData: ReservationRequest = {
      clientId: details.clientId,
      chambreId: details.chambreId,
      dateDebut: details.dateDebut,
      dateFin: details.dateFin
    };

    this.reservationService.createReservation(reservationData).subscribe({
      next: (response) => {
        console.log("✅ Réservation créée avec succès:", response);
        alert("Réservation confirmée !");
        this.showDialog = false;
      },
      error: (error) => {
        console.error("❌ Erreur lors de la réservation:", error);
      }
    });
  }

  closeDialog(): void {
    this.showDialog = false;
  }


  /**
   * ✅ Ouvre le dialogue de réservation pour une chambre spécifique
   */
  openDialog(chambre: Chambre): void {
    console.log("✅ Clic détecté : ouverture de la pop-up pour", chambre.nom);
    this.selectedChambre = chambre;
    this.showDialog = true;
  }
}