import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chambre {
  idChambre: number;
  nom: string;
  type: string;
  prixParNuit: number;
  createdAt: string;
  imageUrl?: string; // Optionnel pour l'image
}

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = 'http://localhost:8080/api/chambres'; // 🔗 URL du backend

  constructor(private http: HttpClient) {}

  /**
   * ✅ Récupère toutes les chambres depuis le backend
   */
  getChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(this.apiUrl);
  }
}
