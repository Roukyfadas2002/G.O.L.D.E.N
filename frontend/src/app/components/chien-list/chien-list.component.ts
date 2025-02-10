import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { ChienService, Chien } from '../../services/chien.service';
import { MatDialog } from '@angular/material/dialog';
import { ChienDialogComponent } from '../chien-dialog/chien-dialog.component';

@Component({
  selector: 'app-chiens',
  standalone: true,
  templateUrl: './chien-list.component.html',
  styleUrls: ['./chien-list.component.css'],
  imports: [CommonModule, NgFor, DatePipe]
})
export class ChienListComponent implements OnInit {
  chiens: Chien[] = [];

  constructor(private chienService: ChienService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadChiens();
  }

  /**
   * ✅ Charge la liste des chiens et remplace les ID des parents par leurs noms
   */
  loadChiens(): void {
    this.chienService.getChiens().subscribe((data) => {
      console.log("✅ Données reçues :", data); // 🔍 Debug
  
      // ✅ Création d'une Map {id: nom} pour retrouver les parents plus rapidement
      const chiensMap = new Map<number, string>();
      data.forEach(chien => {
        chiensMap.set(chien.id!, chien.nom);
      });
  
      // ✅ Transformation des ID parents en noms
      this.chiens = data.map(chien => ({
        ...chien,
        nomPere: chien.idPere ? chiensMap.get(chien.idPere) || 'N/A' : 'N/A',
        nomMere: chien.idMere ? chiensMap.get(chien.idMere) || 'N/A' : 'N/A'
      }));
  
      console.log("📌 Chiens après transformation :", this.chiens); // 🔍 Vérification des données finales
    });
  }
  
  /**
   * ✅ Supprime un chien en vérifiant son ID
   */
  deleteChien(id?: number): void {
    if (id === undefined) {
      console.error("❌ Erreur : ID du chien non défini !");
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce chien ?')) {
      this.chienService.deleteChien(id).subscribe(() => {
        this.loadChiens();
      });
    }
  }

  /**
   * ✅ Calcule l'âge du chien en fonction de sa date de naissance
   */
  getAge(dateNaissance: string): number {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    
    // Vérifier si l'anniversaire est déjà passé cette année
    const moisActuel = today.getMonth();
    const moisNaissance = birthDate.getMonth();
    const jourActuel = today.getDate();
    const jourNaissance = birthDate.getDate();

    if (moisNaissance > moisActuel || (moisNaissance === moisActuel && jourNaissance > jourActuel)) {
      age--; // Réduction de l'âge si l'anniversaire n'est pas encore passé
    }

    return age;
  }

  /**
   * ✅ Ouvre le formulaire en mode "Création" ou "Modification"
   */
  openDialog(chien?: Chien): void {
    console.log("🟡 Ouverture du formulaire avec les données :", chien);
  
    const dialogRef = this.dialog.open(ChienDialogComponent, {
      width: '400px',
      data: chien ? { ...chien } : {} // ✅ Copie les données pour éviter les modifications directes
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("✅ Données soumises depuis le formulaire :", result);
        if (chien?.id) {
          this.chienService.updateChien(chien.id, result).subscribe(() => {
            console.log("✅ Chien modifié avec succès !");
            this.loadChiens();
          });
        } else {
          this.chienService.addChien(result).subscribe(() => {
            console.log("✅ Chien créé avec succès !");
            this.loadChiens();
          });
        }
      } else {
        console.log("❌ Formulaire annulé.");
      }
    });
  }
  

  /**
   * ✅ Affiche les détails d'un chien
   */
  viewDetails(chien: Chien): void {
    alert(`🐶 Détails du chien : \n\nNom : ${chien.nom}\nRace : ${chien.race}\nÂge : ${this.getAge(chien.dateNaissance)} ans`);
  }

  /**
   * ✅ Retourne le nom d'un parent à partir de son ID
   */
  getNomParent(idParent?: number | null): string {
    if (!idParent) return 'N/A'; // ✅ Vérifie `undefined` et `null`
    
    const parent = this.chiens.find(c => c.id === idParent);
    return parent ? parent.nom : 'Inconnu';
  }
}
