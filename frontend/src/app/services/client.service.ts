import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Client {
  idClient: number;  // ✅ Correction : doit être `idClient` (comme dans le backend)
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  createdAt: string;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private BASE_URL = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  getClients(): Observable<Client[]> {
    return this.http.get<any[]>(this.BASE_URL).pipe(
      map(clients =>
        clients.map(client => ({
          idClient: client.idClient, // ✅ Adapter au format du backend
          nom: client.nom,
          prenom: client.prenom,
          email: client.email,
          telephone: client.telephone,
          adresse: client.adresse,
          createdAt: client.createdAt,
          roleName: client.roleName || 'Inconnu' // ✅ Gestion du cas où le rôle est manquant
        }))
      )
    );
  }
}
