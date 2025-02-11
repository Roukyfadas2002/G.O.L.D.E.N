import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// ✅ Modèle TypeScript pour correspondre au backend
export interface Role {
  idRole: number;
  nomRole: string;
}

export interface Client {
  idClient: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  createdAt: string | null;
  roleName: string; // ✅ Assurer que le rôle est bien sous `roleName`
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private BASE_URL = 'http://localhost:8080/api/clients';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les clients avec transformation des données
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.BASE_URL).pipe(
      map(clients =>
        clients.map(client => ({
          ...client,
          role: client.roleName || { idRole: 0, nomRole: 'Inconnu' } // ✅ Gestion du rôle manquant
        }))
      )
    );
  }

  // ✅ Récupérer un client par son ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.BASE_URL}/${id}`);
  }

  // ✅ Ajouter un client
  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.BASE_URL, client);
  }

  // ✅ Modifier un client
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.BASE_URL}/${id}`, client);
  }

  // ✅ Supprimer un client
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}