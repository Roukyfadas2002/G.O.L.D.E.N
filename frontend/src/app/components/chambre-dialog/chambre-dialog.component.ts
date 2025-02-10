import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

export interface Chambre {
  idChambre?: number;
  nom: string;
  type: string;
  prixParNuit: number;
}

@Component({
  selector: 'app-chambre-dialog',
  standalone: true,
  templateUrl: './chambre-dialog.component.html',
  styleUrls: ['./chambre-dialog.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule, // ✅ Ajouté ici pour formGroup
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ChambreDialogComponent {
  chambreForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChambreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Chambre
  ) {
    this.chambreForm = this.fb.group({
      nom: [data.nom, Validators.required],
      type: [data.type, Validators.required],
      prixParNuit: [data.prixParNuit, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.chambreForm.valid) {
      this.dialogRef.close(this.chambreForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
