import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Nécessaire pour `ngModel`
import { CommonModule } from '@angular/common';

export interface ReservationDetails {
  clientId: number;
  chambreId: number;
  dateDebut: string;
  dateFin: string;
}

@Component({
  selector: 'app-reservation-dialog',
  standalone: true,
  templateUrl: './reservation-dialog.component.html',
  styleUrls: ['./reservation-dialog.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Ajout de FormsModule
})
export class ReservationDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() chambreId: number = 0;
  @Input() chambreNom: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<ReservationDetails>();

  reservation: ReservationDetails = { clientId: 0, chambreId: 0, dateDebut: '', dateFin: '' };

  ngOnInit(): void {
    // 🔥 Récupération du client connecté
    const storedId = localStorage.getItem('clientId');
    if (storedId) {
      this.reservation.clientId = parseInt(storedId, 10);
      console.log("✅ Client ID récupéré :", this.reservation.clientId);
    } else {
      console.warn("⚠️ Aucun utilisateur connecté !");
    }

    // 🔥 Vérification du `chambreId`
    if (this.chambreId > 0) {
      this.reservation.chambreId = this.chambreId;
      console.log("✅ Chambre ID affecté :", this.chambreId);
    } else {
      console.error("❌ Erreur: `chambreId` est invalide !");
    }
  }

  /**
   * ✅ Vérifie si la réservation est valide
   */
  isValid(): boolean {
    if (!this.reservation.clientId) {
      console.warn("⚠️ Aucune ID client trouvée !");
      return false;
    }

    if (!this.reservation.chambreId) {
      console.warn("⚠️ Aucune chambre sélectionnée !");
      return false;
    }
    
    if (!this.reservation.dateDebut || !this.reservation.dateFin) {
      console.warn("⚠️ Dates de réservation manquantes !");
      return false;
    }

    const dateDebut = new Date(this.reservation.dateDebut);
    const dateFin = new Date(this.reservation.dateFin);

    if (dateDebut >= dateFin) {
      console.warn("❌ Date de fin invalide !");
      return false;
    }

    return true;
  }

  onCancel(): void {
    console.log("❌ Annulation de la réservation");
    this.close.emit();
  }

  onConfirm(): void {
    console.log("📡 Tentative de réservation avec :", this.reservation);
  
    if (!this.isValid()) {
      console.error("❌ Données manquantes pour la réservation !");
      return;
    }
  
    console.log("✅ Réservation confirmée :", this.reservation);
    this.confirm.emit(this.reservation);
    this.close.emit();
  }
}