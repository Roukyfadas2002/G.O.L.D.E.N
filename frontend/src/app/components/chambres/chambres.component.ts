import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ChambreService, Chambre } from '../../services/chambre.service';
import { ChambreDialogComponent } from '../chambre-dialog/chambre-dialog.component';

@Component({
  selector: 'app-chambres',
  standalone: true,
  templateUrl: './chambres.component.html',
  styleUrls: ['./chambres.component.css'],
  imports: [CommonModule]
})
export class ChambresComponent {
  chambres: Chambre[] = [];

  constructor(private chambreService: ChambreService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadChambres();
  }

  loadChambres(): void {
    this.chambreService.getChambres().subscribe(data => {
      this.chambres = data;
    });
  }

  openDialog(chambre?: Chambre): void {
    const dialogRef = this.dialog.open(ChambreDialogComponent, {
      width: '400px',
      data: chambre ? { ...chambre } : { nom: '', type: '', prixParNuit: 0, imageUrl: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (chambre) {
          this.updateChambre(chambre.idChambre!, result);
        } else {
          this.addChambre(result);
        }
      }
    });
  }

  addChambre(chambre: Chambre): void {
    this.chambreService.addChambre(chambre).subscribe(() => {
      this.loadChambres();
    });
  }

  updateChambre(id: number, chambre: Chambre): void {
    this.chambreService.updateChambre(id, chambre).subscribe(() => {
      this.loadChambres();
    });
  }

  deleteChambre(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette chambre ?")) {
      this.chambreService.deleteChambre(id).subscribe(() => {
        this.loadChambres();
      });
    }
  }
}
