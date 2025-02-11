import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService, Client } from '../../services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogComponent } from '../client-dialog/client-dialog.component';

@Component({
  selector: 'app-clients',
  standalone: true,
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: number = 0; // 0 = none, 1 = asc, -1 = desc

  constructor(private clientService: ClientService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // ✅ Charger la liste des clients
  loadClients(): void {
    this.clientService.getClients().subscribe(data => {
      this.clients = data.map(client => ({
        ...client,
        roleName: client.roleName || 'Inconnu', // ✅ Utilisation directe de `roleName`
        createdAt: client.createdAt ? client.createdAt : 'Non disponible' // ✅ Gérer `null`
      }));
      this.filteredClients = [...this.clients];
    });
  }

  // ✅ Filtrer la liste des clients
  filterClients(): void {
    this.filteredClients = this.clients.filter(client =>
      client.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortClients();
  }

  // ✅ Trier la liste des clients
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 1 ? -1 : this.sortDirection === -1 ? 0 : 1;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }
    this.sortClients();
  }

  sortClients(): void {
    if (this.sortDirection === 0) {
      this.filteredClients = [...this.clients];
      return;
    }

    this.filteredClients.sort((a, b) => {
      let valueA = a[this.sortColumn as keyof Client] ?? '';
      let valueB = b[this.sortColumn as keyof Client] ?? '';

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      return (valueA > valueB ? 1 : -1) * this.sortDirection;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-solid fa-sort';
    return this.sortDirection === 1 ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
  }

  // ✅ Ouvrir le dialogue pour modifier ou ajouter un client
  openDialog(client?: Client): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '500px',
      data: client ? { ...client } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClients();
      }
    });
  }

  // ✅ Supprimer un client
  deleteClient(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce client ?")) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.loadClients();
      });
    }
  }
}