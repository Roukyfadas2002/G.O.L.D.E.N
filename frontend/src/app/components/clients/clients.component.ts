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
    this.loadClients();
  }

  // ✅ Charger la liste des clients
  loadClients(): void {
    this.clientService.getClients().subscribe(data => {
      this.clients = data.map(client => ({
        ...client,
        roleName: client.roleName || 'Inconnu'
      }));
    });
  }

  // ✅ Afficher les détails d'un client
  viewDetails(client: Client): void {
    alert(`👤 Détails du client :\n\n📛 Nom: ${client.nom} ${client.prenom}\n✉️ Email: ${client.email}\n📞 Téléphone: ${client.telephone}\n🏠 Adresse: ${client.adresse}\n🔰 Rôle: ${client.roleName}`);
  }
}
