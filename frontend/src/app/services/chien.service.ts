import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Chien {
  idChien: number;
  nom: string;
  race: string;
  age: number;
  idPere?: number | null;
  idMere?: number | null;
  createdAt: string;
  nomPere?: string | null; // ✅ Ajout pour afficher le nom du père
  nomMere?: string | null; // ✅ Ajout pour afficher le nom de la mère
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

  // ✅ Ajouter un chien (pour plus tard)
  addChien(chien: Chien): Observable<Chien> {
    return this.http.post<Chien>(this.apiUrl, chien);
  }

  // ✅ Supprimer un chien (pour plus tard)
  deleteChien(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
