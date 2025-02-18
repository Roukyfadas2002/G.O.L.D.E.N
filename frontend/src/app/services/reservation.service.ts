import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reservation {
  idReservation: number;
  client: { idClient: number; nom: string; prenom: string };
  chambre: { idChambre: number; nom: string };
  dateDebut: string;
  dateFin: string;
  status: string;
}

/**
 * ✅ Interface pour créer une nouvelle réservation
 */
export interface ReservationRequest {
  clientId: number;
  chambreId: number;
  dateDebut: string;
  dateFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8080/api/reservations';

  constructor(private http: HttpClient) {}

  /**
   * ✅ Récupérer toutes les réservations
   */
  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/all`);
  }

  /**
   * ✅ Mettre à jour le statut d'une réservation
   */
  updateReservationStatus(id: number, status: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/${id}/status`, { status }, { headers });
  }

  /**
   * ✅ Supprimer une réservation
   */
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  /**
   * ✅ Créer une nouvelle réservation
   */
  createReservation(data: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/create`, {
      clientId: data.clientId,
      chambreId: data.chambreId,
      dateDebut: data.dateDebut,
      dateFin: data.dateFin
    });
  }
}