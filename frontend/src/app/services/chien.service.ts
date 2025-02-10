import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chien {
  id?: number; // ✅ `id` peut être `undefined` lors de la création
  nom: string;
  race: string;
  dateNaissance: string;
  idPere?: number | null;
  idMere?: number | null;
  createdAt?: string;
  nomPere?: string | null;
  nomMere?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChienService {
  private apiUrl = 'http://localhost:8080/api/chiens'; // 📌 Endpoint du backend

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les chiens
  getChiens(): Observable<Chien[]> {
    return this.http.get<Chien[]>(this.apiUrl);
  }

  // ✅ Récupérer un chien par ID
  getChienById(id: number): Observable<Chien> {
    return this.http.get<Chien>(`${this.apiUrl}/${id}`);
  }

  // ✅ Récupérer les chiens d'un propriétaire spécifique
  getChiensByProprietaire(idClient: number): Observable<Chien[]> {
    return this.http.get<Chien[]>(`${this.apiUrl}/proprietaire/${idClient}`);
  }

  // ✅ Ajouter un chien
  addChien(chien: Chien): Observable<Chien> {
    console.log("📤 Envoi de la requête POST au backend :", chien); // 🔍 Debug
    return this.http.post<Chien>(this.apiUrl, chien);
  }

  // ✅ Modifier un chien
  updateChien(id: number, chien: Chien): Observable<Chien> {
    console.log(`📤 Envoi de la requête PUT au backend pour l'ID ${id} :`, chien); // 🔍 Debug
    return this.http.put<Chien>(`${this.apiUrl}/${id}`, chien);
  }

  // ✅ Supprimer un chien
  deleteChien(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
