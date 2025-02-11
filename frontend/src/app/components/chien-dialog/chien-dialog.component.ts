import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChienService, Chien } from '../../services/chien.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core'; // ✅ Correction : Ajout du module nécessaire

@Component({
  selector: 'app-chien-dialog',
  templateUrl: './chien-dialog.component.html',
  styleUrls: ['./chien-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule // ✅ Import correct pour mat-option
  ]
})
export class ChienDialogComponent implements OnInit {
  chienForm: FormGroup;
  chiens: Chien[] = [];
  isEditMode: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChienDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chien | null,
    private fb: FormBuilder,
    private chienService: ChienService
  ) {
    this.isEditMode = !!data?.id;

    // ✅ Initialisation correcte du formulaire
    this.chienForm = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      race: [data?.race || '', Validators.required],
      dateNaissance: [data?.dateNaissance || '', Validators.required],
      pere: [data?.idPere || null],  // ✅ Utilisation de `idPere`
      mere: [data?.idMere || null]   // ✅ Utilisation de `idMere`
    });
    
  }

  ngOnInit(): void {
    this.chienService.getChiens().subscribe((chiens) => {
      this.chiens = chiens.filter(c => c.id !== this.data?.id);
    });
  }

  onSubmit(): void {
    if (this.chienForm.valid) {
      const formValues = this.chienForm.value;

      // ✅ Vérifie et transforme correctement les parents
      const chienData: any = {
        ...formValues,
        pere: formValues.pere ? { idChien: formValues.pere } : null,
        mere: formValues.mere ? { idChien: formValues.mere } : null
      };

      console.log("📤 Données envoyées :", chienData);

      if (this.isEditMode) {
        this.chienService.updateChien(this.data!.id!, chienData).subscribe({
          next: (response) => {
            console.log("✅ Chien modifié avec succès :", response);
            this.dialogRef.close(response);
          },
          error: (err) => {
            console.error("❌ Erreur lors de la modification :", err);
          }
        });
      } else {
        this.chienService.addChien(chienData).subscribe({
          next: (response) => {
            console.log("✅ Chien créé avec succès :", response);
            this.dialogRef.close(response);
          },
          error: (err) => {
            console.error("❌ Erreur lors de la création :", err);
          }
        });
      }
    } else {
      console.error("❌ Formulaire invalide !");
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
