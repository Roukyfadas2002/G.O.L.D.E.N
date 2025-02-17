import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { RoleService } from '../../services/role.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface Role {
  idRole: number;
  nomRole: string;
}

@Component({
  selector: 'app-client-dialog',
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ]
})
export class ClientDialogComponent implements OnInit {
  clientForm!: FormGroup;
  roles: Role[] = [];
  isEditMode: boolean = false;
  showPassword: boolean = false; // ✅ Ajout de la variable pour afficher/masquer le mot de passe

  constructor(
    public dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private clientService: ClientService,
    private roleService: RoleService
  ) {
    this.isEditMode = !!data?.idClient; // ✅ Vérifie si on est en mode édition
  }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      nom: [this.data?.nom || '', Validators.required],
      prenom: [this.data?.prenom || '', Validators.required],
      email: [this.data?.email || '', [Validators.required, Validators.email]],
      password: [''], // 📝 Le mot de passe reste vide par défaut en édition
      telephone: [this.data?.telephone || '', Validators.required],
      adresse: [this.data?.adresse || '', Validators.required],
      role: [null, Validators.required] // ✅ Correction : rôle défini après chargement
    });

    // ✅ Charger les rôles et pré-remplir le rôle sélectionné
    this.roleService.getRoles().subscribe(roles => {
      this.roles = roles;

      // ✅ Trouver le rôle actuel et l'appliquer
      const existingRole = this.roles.find(r => r.nomRole === this.data?.roleName);
      if (existingRole) {
        this.clientForm.patchValue({ role: existingRole.idRole });
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formValues = this.clientForm.value;

      // ✅ Prépare l'objet à envoyer
      const clientData: any = {
        ...formValues,
        role: { idRole: formValues.role } // ✅ Rôle structuré correctement
      };

      // ✅ Ne pas envoyer le champ `password` s'il est vide
      if (this.isEditMode && (!formValues.password || formValues.password.trim() === '')) {
        delete clientData.password;
      }

      console.log("📤 Données envoyées :", clientData);

      if (this.isEditMode) {
        this.clientService.updateClient(this.data.idClient, clientData).subscribe(response => {
          this.dialogRef.close(response);
        });
      } else {
        this.clientService.addClient(clientData).subscribe(response => {
          this.dialogRef.close(response);
        });
      }
    }
  }

  dropdownOpen = false;
  selectedRole: string | null = null;
  onCancel(): void {
    this.dialogRef.close();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectRole(role: Role): void {
    this.selectedRole = role.nomRole;
    this.clientForm.patchValue({ role: role.idRole });
    this.dropdownOpen = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordField = document.querySelector('input[formControlName="password"]') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  }
}