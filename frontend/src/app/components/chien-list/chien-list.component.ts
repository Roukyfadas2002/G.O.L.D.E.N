import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChienService, Chien } from '../../services/chien.service';
import { MatDialog } from '@angular/material/dialog';
import { ChienDialogComponent } from '../chien-dialog/chien-dialog.component';

@Component({
  selector: 'app-chien-list',
  standalone: true,
  templateUrl: './chien-list.component.html',
  styleUrls: ['./chien-list.component.css'],
  imports: [CommonModule]
})
export class ChienListComponent implements OnInit {
  chiens: Chien[] = [];

  constructor(private chienService: ChienService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadChiens();
  }

  // ✅ Charger la liste des chiens et transformer les ID parents en noms
  loadChiens(): void {
    this.chienService.getChiens().subscribe((data) => {
      console.log("✅ Données reçues :", data); // 🔍 Debug

      // ✅ Création d'une Map {id: nom} pour retrouver les parents rapidement
      const chiensMap = new Map<number, string>();
      data.forEach(chien => {
        if (chien.id) {
          chiensMap.set(chien.id, chien.nom);
        }
      });

      // ✅ Transformation des ID parents en noms
      this.chiens = data.map(chien => ({
        ...chien,
        nomPere: chien.idPere ? chiensMap.get(chien.idPere) || 'N/A' : 'N/A',
        nomMere: chien.idMere ? chiensMap.get(chien.idMere) || 'N/A' : 'N/A'
      }));

      console.log("📌 Chiens après transformation :", this.chiens); // 🔍 Vérifie les noms des parents
    });
  }

  // ✅ Supprimer un chien
  deleteChien(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce chien ?')) {
      this.chienService.deleteChien(id).subscribe(() => {
        this.loadChiens();
      });
    }
  }

  // ✅ Calculer l'âge
  getAge(dateNaissance: string): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    return today.getFullYear() - birthDate.getFullYear();
  }

  // ✅ Voir les détails d'un chien
  viewDetails(chien: Chien): void {
    alert(`🐶 Détails du chien :
    \nNom : ${chien.nom}
    \nRace : ${chien.race}
    \nDate de Naissance : ${chien.dateNaissance}
    \nÂge : ${this.getAge(chien.dateNaissance)} ans
    \nPère : ${chien.nomPere}
    \nMère : ${chien.nomMere}`);
  }

  // ✅ Ouvrir le dialogue pour modifier ou ajouter un chien
  openDialog(chien?: Chien): void {
    const dialogRef = this.dialog.open(ChienDialogComponent, {
      width: '500px',
      data: chien ? { ...chien } : {} // Envoie les données du chien si c'est une modification
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadChiens();
      }
    });
  }
}
