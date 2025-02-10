import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChienService, Chien } from '../../services/chien.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-chien-dialog',
  templateUrl: './chien-dialog.component.html',
  styleUrls: ['./chien-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class ChienDialogComponent implements OnInit {
  chienForm: FormGroup;
  chiens: Chien[] = []; // ✅ Liste des chiens pour sélectionner le père/mère
  isEditMode: boolean = false; // ✅ Mode édition ou création

  constructor(
    public dialogRef: MatDialogRef<ChienDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chien | null,
    private fb: FormBuilder,
    private chienService: ChienService
  ) {
    this.isEditMode = !!data?.id; // ✅ Vérifie si on est en mode édition

    this.chienForm = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      race: [data?.race || '', Validators.required],
      dateNaissance: [data?.dateNaissance || '', Validators.required],
      pere: [data?.idPere ? data.idPere : null], // ✅ Stocke directement l'ID
      mere: [data?.idMere ? data.idMere : null]  // ✅ Stocke directement l'ID
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

      // ✅ Correction : Envoie les parents sous forme { idChien: number }
      const chienData = {
        ...formValues,
        pere: formValues.pere ? { idChien: formValues.pere } : null,
        mere: formValues.mere ? { idChien: formValues.mere } : null
      };

      console.log("📤 Données envoyées :", chienData);
      this.dialogRef.close(chienData);
    } else {
      console.error("❌ Formulaire invalide !");
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
