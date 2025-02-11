import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Correction FormsModule ajouté
import { ChienService, Chien } from '../../services/chien.service';
import { MatDialog } from '@angular/material/dialog';
import { ChienDialogComponent } from '../chien-dialog/chien-dialog.component';

@Component({
  selector: 'app-chien-list',
  standalone: true,
  templateUrl: './chien-list.component.html',
  styleUrls: ['./chien-list.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Correction FormsModule ajouté ici
})
export class ChienListComponent implements OnInit {
  chiens: Chien[] = [];
  filteredChiens: Chien[] = [];
  searchTerm: string = '';
  filterRace: string = '';
  uniqueRaces: string[] = []; // ✅ Correction : Définition de uniqueRaces

  constructor(private chienService: ChienService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadChiens();
  }

  loadChiens(): void {
    this.chienService.getChiens().subscribe((data) => {
      const chiensMap = new Map<number, string>();
      data.forEach(chien => {
        if (chien.id) {
          chiensMap.set(chien.id, chien.nom);
        }
      });

      this.chiens = data.map(chien => ({
        ...chien,
        nomPere: chien.idPere ? chiensMap.get(chien.idPere) || 'N/A' : 'N/A',
        nomMere: chien.idMere ? chiensMap.get(chien.idMere) || 'N/A' : 'N/A'
      }));

      this.filteredChiens = [...this.chiens];
      this.updateUniqueRaces();
    });
  }

  updateUniqueRaces(): void {
    this.uniqueRaces = Array.from(new Set(this.chiens.map(c => c.race)));
  }

  filterChiens(): void {
    this.filteredChiens = this.chiens.filter(chien => 
      chien.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.filterRace ? chien.race === this.filterRace : true)
    );
    this.sortChiens();
  }

  sortColumn: string = ''; 
  sortDirection: number = 0; // 0 = none, 1 = asc, -1 = desc
  
  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 1 ? -1 : this.sortDirection === -1 ? 0 : 1; // Cycle: asc → desc → none
    } else {
      this.sortColumn = column;
      this.sortDirection = 1; // Commence par le tri ascendant
    }
    this.sortChiens();
  }
  
  sortChiens(): void {
    if (this.sortDirection === 0) {
      this.filteredChiens = [...this.chiens]; // Réinitialise l'ordre d'origine
      return;
    }
  
    this.filteredChiens.sort((a, b) => {
      let valueA = a[this.sortColumn as keyof Chien] || '';
      let valueB = b[this.sortColumn as keyof Chien] || '';
  
      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();
  
      return (valueA > valueB ? 1 : -1) * this.sortDirection;
    });
  }
  
  // ✅ Mise à jour de l'icône en fonction du tri actif
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-solid fa-sort'; // Mode "none"
    return this.sortDirection === 1 
      ? 'fa-solid fa-sort-up animated-sort'   // Mode "asc"
      : this.sortDirection === -1 
        ? 'fa-solid fa-sort-down animated-sort' // Mode "desc"
        : 'fa-solid fa-sort'; // Mode "none"
  }
  
  

  getAge(dateNaissance: string): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    return today.getFullYear() - birthDate.getFullYear();
  }

  viewDetails(chien: Chien): void {
    alert(`🐶 Détails du chien :
    \nNom : ${chien.nom}
    \nRace : ${chien.race}
    \nDate de Naissance : ${chien.dateNaissance}
    \nÂge : ${this.getAge(chien.dateNaissance)} ans
    \nPère : ${chien.nomPere}
    \nMère : ${chien.nomMere}`);
  }

  openDialog(chien?: Chien): void {
    const dialogRef = this.dialog.open(ChienDialogComponent, {
      width: '500px',
      data: chien ? { ...chien } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChiens();
      }
    });
  }

  // ✅ Correction : Ajout de deleteChien
  deleteChien(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chien ?')) {
      this.chienService.deleteChien(id).subscribe(() => {
        this.loadChiens();
      });
    }
  }
}
