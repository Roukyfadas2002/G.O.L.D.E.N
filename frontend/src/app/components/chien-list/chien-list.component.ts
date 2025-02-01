import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChienService, Chien } from '../../services/chien.service';

@Component({
  selector: 'app-chien-list',
  standalone: true,
  templateUrl: './chien-list.component.html',
  styleUrls: ['./chien-list.component.css'],
  imports: [CommonModule]
})
export class ChienListComponent implements OnInit {
  chiens: Chien[] = [];

  constructor(private chienService: ChienService) {}

  ngOnInit(): void {
    this.loadChiens();
  }

  // ✅ Charger la liste des chiens et récupérer les noms des parents
  loadChiens(): void {
    this.chienService.getChiens().subscribe(data => {
      this.chiens = data.map(chien => ({
        ...chien,
        nomPere: chien.idPere ? this.getParentName(data, chien.idPere) : null,
        nomMere: chien.idMere ? this.getParentName(data, chien.idMere) : null
      }));
    });
  }

  // ✅ Trouver le nom du parent par son ID
  getParentName(chiens: Chien[], parentId?: number | null): string | null {
    return chiens.find(c => c.idChien === parentId)?.nom || null;
  }

  // ✅ Afficher les détails d'un chien
  viewDetails(chien: Chien): void {
    alert(`Détails du chien : ${chien.nom}\nRace: ${chien.race}\nÂge: ${chien.age}`);
  }
}
