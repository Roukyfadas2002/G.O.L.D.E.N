import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chambre {
  idChambre?: number; // `idChambre` est optionnel pour la création
  nom: string;
  type: string;
  prixParNuit: number;
  createdAt?: string; // Optionnel, géré par le backend
  imageUrl?: string; // Optionnel pour l'image
}

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = 'http://localhost:8080/api/chambres'; // 🔗 URL du backend

  constructor(private http: HttpClient) {}

  /**
   * ✅ Récupère toutes les chambres
   */
  getChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(this.apiUrl);
  }

  /**
   * ✅ Récupère une chambre par ID
   */
  getChambreById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/${id}`);
  }

  /**
   * ✅ Ajoute une nouvelle chambre
   */
  addChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(this.apiUrl, chambre);
  }

  /**
   * ✅ Modifie une chambre existante
   */
  updateChambre(id: number, chambre: Chambre): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.apiUrl}/${id}`, chambre);
  }

  /**
   * ✅ Supprime une chambre
   */
  deleteChambre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
