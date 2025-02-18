import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService, Reservation } from '../../services/reservation.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-reservations',
  standalone: true,
  templateUrl: './gestion-reservations.component.html',
  styleUrls: ['./gestion-reservations.component.css'],
  imports: [CommonModule, FormsModule]
})
export class GestionReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filters = { client: '', chambre: '', status: '' };
  sortColumn: string = '';
  sortDirection: number = 1; // 1 = asc, -1 = desc

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  /**
   * ✅ Charger toutes les réservations
   */
  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        console.log("✅ Réservations chargées :", data);
        this.reservations = data;
      },
      error: (error) => {
        console.error("❌ Erreur lors du chargement des réservations :", error);
      }
    });
  }

  mettreEnCharge(id: number): void {
    this.updateReservationStatus(id, "Pris en compte");
  }

  /**
   * ✅ Confirmer une réservation (statut "Confirmée")
   */
  confirmerReservation(id: number): void {
    this.updateReservationStatus(id, "Confirmée");
  }

  /**
   * ✅ Rejeter une réservation (statut "Refusée")
   */
  rejeterReservation(id: number): void {
    this.updateReservationStatus(id, "Refusée");
  }

  /**
   * ✅ Mettre à jour le statut d'une réservation
   */
  private updateReservationStatus(id: number, newStatus: string): void {
    this.reservationService.updateReservationStatus(id, newStatus).subscribe({
      next: () => {
        console.log(`✅ Réservation ${id} mise à jour : ${newStatus}`);
        this.loadReservations();
      },
      error: (error) => {
        console.error("❌ Erreur lors de la mise à jour de la réservation :", error);
      }
    });
  }

  /**
   * ✅ Supprimer une réservation
   */
  supprimerReservation(id: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      this.reservationService.deleteReservation(id).subscribe({
        next: () => {
          console.log(`🗑️ Réservation ${id} supprimée`);
          this.loadReservations();
        },
        error: (error) => {
          console.error("❌ Erreur lors de la suppression de la réservation :", error);
        }
      });
    }
  }

  /**
   * ✅ Appliquer les filtres
   */
  filteredReservations(): Reservation[] {
    return this.reservations
      .filter(r => 
        (!this.filters.client || 
          (r.client.nom + ' ' + r.client.prenom).toLowerCase().includes(this.filters.client.toLowerCase())) &&
        (!this.filters.chambre || 
          r.chambre.nom.toLowerCase().includes(this.filters.chambre.toLowerCase())) &&
        (!this.filters.status || r.status === this.filters.status)
      )
      .sort((a, b) => this.compare(a, b));
  }

  /**
   * ✅ Réinitialiser les filtres
   */
  resetFilters(): void {
    this.filters = { client: '', chambre: '', status: '' };
  }

  /**
   * ✅ Trier par colonne
   */
  sortBy(column: string): void {
    this.sortDirection = this.sortColumn === column ? -this.sortDirection : 1;
    this.sortColumn = column;
  }

  /**
   * ✅ Comparaison pour le tri
   */
  private compare(a: any, b: any): number {
    let valueA = this.getNestedValue(a, this.sortColumn);
    let valueB = this.getNestedValue(b, this.sortColumn);
    return (valueA > valueB ? 1 : -1) * this.sortDirection;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => o && o[key], obj);
  }
}