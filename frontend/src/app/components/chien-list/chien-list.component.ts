import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ChienService, Chien } from '../../services/chien.service';
import { MatDialog } from '@angular/material/dialog';
import { ChienDialogComponent } from '../chien-dialog/chien-dialog.component';

@Component({
  selector: 'app-chien-list',
  standalone: true,
  templateUrl: './chien-list.component.html',
  styleUrls: ['./chien-list.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChienListComponent implements OnInit {
  chiens: Chien[] = [];
  filteredChiens: Chien[] = [];
  searchTerm: string = '';
  filterRace: string = '';
  uniqueRaces: string[] = [];
  sortColumn: string = ''; 
  sortDirection: number = 0;

  constructor(
    private chienService: ChienService, 
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadChiens();
  }

  loadChiens(): void {
    this.chienService.getChiens().subscribe((data) => {
      console.log("✅ Données reçues :", data);

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

      this.updateUniqueRaces();
      this.applyFilters(); // 🔥 Appliquer les filtres dès le chargement
    });
  }

  updateUniqueRaces(): void {
    this.uniqueRaces = Array.from(new Set(this.chiens.map(c => c.race)));
  }

  applyFilters(): void {
    console.log("🔍 Avant filtrage, taille :", this.filteredChiens.length);

    this.filteredChiens = this.chiens.filter(chien => 
      chien.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.filterRace || chien.race === this.filterRace)
    );

    console.log("📌 Après filtrage, taille :", this.filteredChiens.length, this.filteredChiens);

    this.filteredChiens = [...this.filteredChiens]; // 🔥 Création d'une nouvelle instance pour forcer le rafraîchissement
    this.changeDetector.detectChanges(); // 🔥 Forcer la détection des changements
  }

  filterChiens(): void {
    console.log("🔍 Filtres appliqués :", { searchTerm: this.searchTerm, filterRace: this.filterRace });
    this.applyFilters();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 1 ? -1 : this.sortDirection === -1 ? 0 : 1;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }
    this.sortChiens();
  }
  
  sortChiens(): void {
    if (this.sortDirection === 0) {
      this.filteredChiens = [...this.chiens];
      return;
    }

    this.filteredChiens.sort((a, b) => {
      let valueA = a[this.sortColumn as keyof Chien] || '';
      let valueB = b[this.sortColumn as keyof Chien] || '';

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      return (valueA > valueB ? 1 : -1) * this.sortDirection;
    });

    console.log("📌 Après tri :", this.filteredChiens);

    this.filteredChiens = [...this.filteredChiens]; // 🔥 Rafraîchir après tri
    this.changeDetector.markForCheck(); // 🔥 Forcer la détection
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-solid fa-sort';
    return this.sortDirection === 1 
      ? 'fa-solid fa-sort-up animated-sort'
      : this.sortDirection === -1 
        ? 'fa-solid fa-sort-down animated-sort'
        : 'fa-solid fa-sort';
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

  deleteChien(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chien ?')) {
      this.chienService.deleteChien(id).subscribe(() => {
        this.loadChiens();
      });
    }
  }
}