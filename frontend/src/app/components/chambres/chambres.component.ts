import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChambreService, Chambre } from '../../services/chambre.service';
import { MatDialog } from '@angular/material/dialog';
import { ChambreDialogComponent } from '../chambre-dialog/chambre-dialog.component';

@Component({
  selector: 'app-chambres',
  standalone: true,
  templateUrl: './chambres.component.html',
  styleUrls: ['./chambres.component.css'],
  imports: [CommonModule, FormsModule]
})
export class ChambresComponent implements OnInit {
  chambres: Chambre[] = [];
  filteredChambres: Chambre[] = [];
  searchTerm: string = '';
  filterType: string = '';
  filterPrice: number | null = null;
  sortColumn: string = '';
  sortDirection: number = 0; // 0 = Aucun tri, 1 = Asc, -1 = Desc
  uniqueTypes: string[] = [];

  constructor(
    private chambreService: ChambreService, 
    private dialog: MatDialog, 
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadChambres();
  }

  loadChambres(): void {
    this.chambreService.getChambres().subscribe(data => {
      console.log("✅ Données reçues :", data);

      this.chambres = [...data]; // 🔥 Toujours une nouvelle instance
      this.updateUniqueTypes();
      this.applyFilters();
    });
  }

  updateUniqueTypes(): void {
    this.uniqueTypes = Array.from(new Set(this.chambres.map(c => c.type)));
  }

  applyFilters(): void {
    console.log("🔍 Avant filtrage, taille :", this.filteredChambres.length);

    this.filteredChambres = this.chambres.filter(chambre => 
      chambre.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.filterType || chambre.type === this.filterType) &&
      (this.filterPrice === null || chambre.prixParNuit <= this.filterPrice)
    );

    console.log("📌 Après filtrage, taille :", this.filteredChambres.length, this.filteredChambres);

    this.filteredChambres = [...this.filteredChambres]; // 🔥 Création d'une nouvelle instance pour forcer le rafraîchissement
    this.changeDetector.detectChanges(); // 🔥 Forcer la détection des changements
  }

  filterChambres(): void {
    console.log("🔍 Filtres appliqués :", { searchTerm: this.searchTerm, filterType: this.filterType, filterPrice: this.filterPrice });
    this.applyFilters();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 1 ? -1 : this.sortDirection === -1 ? 0 : 1;
    } else {
      this.sortColumn = column;
      this.sortDirection = 1;
    }
    this.sortChambres();
  }

  sortChambres(): void {
    if (this.sortDirection === 0) {
      this.filteredChambres = [...this.chambres];
      return;
    }

    this.filteredChambres.sort((a, b) => {
      let valueA = a[this.sortColumn as keyof Chambre] ?? '';
      let valueB = b[this.sortColumn as keyof Chambre] ?? '';

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      return (valueA > valueB ? 1 : -1) * this.sortDirection;
    });

    console.log("📌 Après tri :", this.filteredChambres);

    this.filteredChambres = [...this.filteredChambres]; // 🔥 Rafraîchir après tri
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

  openDialog(chambre?: Chambre): void {
    const dialogRef = this.dialog.open(ChambreDialogComponent, {
      width: '500px',
      data: chambre ? { ...chambre } : { nom: '', type: '', prixParNuit: 0, imageUrl: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        chambre ? this.updateChambre(chambre.idChambre!, result) : this.addChambre(result);
      }
    });
  }

  addChambre(chambre: Chambre): void {
    this.chambreService.addChambre(chambre).subscribe(() => this.loadChambres());
  }

  updateChambre(id: number, chambre: Chambre): void {
    this.chambreService.updateChambre(id, chambre).subscribe(() => this.loadChambres());
  }

  deleteChambre(id: number): void {
    if (confirm("Voulez-vous supprimer cette chambre ?")) {
      this.chambreService.deleteChambre(id).subscribe(() => this.loadChambres());
    }
  }
}