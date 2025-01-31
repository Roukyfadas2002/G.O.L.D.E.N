import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService, Client } from '../../services/client.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  imports: [CommonModule]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.clients = data.map(client => ({
          ...client,
          roleName: client.roleName,       // ✅ On prend directement le nom du rôle depuis l'API
        }));
      },
      (error) => console.error('Erreur lors de la récupération des clients', error)
    );
  }
}
