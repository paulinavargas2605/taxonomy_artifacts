import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { CategoryService } from '../../services/category.service';
import { Filo, Clase, Orden, Familia, Genero, Especie } from '../../models/category';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-artifact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './artifact-form.component.html',
  styleUrl: './artifact-form.component.css'
})
export class ArtifactFormComponent implements OnInit {

  // form with the artifact's general data (last step)
  form: FormGroup;

  // users available for the select
  users: User[] = [];

  // lists for each taxonomy level
  phyla: Filo[] = [];
  classes: Clase[] = [];
  orders: Orden[] = [];
  families: Familia[] = [];
  genera: Genero[] = [];
  species: Especie[] = [];

  // current selection at each level
  selectedPhylum?: Filo;
  selectedClass?: Clase;
  selectedOrder?: Orden;
  selectedFamily?: Familia;
  selectedGenus?: Genero;
  selectedSpecies?: Especie;

  loading = false;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private userService: UserService,
    private dialogRef: MatDialogRef<ArtifactFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = this.fb.group({

      nombre: ['', Validators.required],

      descripcion: [''],

      id_usuario: ['', Validators.required],

      url_imagen: [''],

      activo: [true]

    });

    if (data) {

      this.editMode = true;

      this.form.patchValue(data);

      // in edit mode a species is already assigned; it is kept
      // even if the user doesn't repeat the taxonomy walkthrough
      this.selectedSpecies = { id_especie: data.id_especie, nombre: '' };

    }

  }

  ngOnInit(): void {

    this.loadPhyla();

    this.loadUsers();

  }

  loadUsers() {

    this.userService.list().subscribe({

      next: (data) => {
        this.users = data;
      },

      error: () => {}

    });

  }

  loadPhyla() {

    this.loading = true;

    this.categoryService.listPhyla().subscribe({

      next: (data) => {
        this.phyla = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectPhylum(phylum: Filo) {

    this.selectedPhylum = phylum;

    // clear everything that depended on the previous phylum
    this.selectedClass = undefined;
    this.selectedOrder = undefined;
    this.selectedFamily = undefined;
    this.selectedGenus = undefined;
    this.selectedSpecies = undefined;
    this.classes = [];
    this.orders = [];
    this.families = [];
    this.genera = [];
    this.species = [];

    this.loading = true;

    this.categoryService.listClasses(phylum.id_filo).subscribe({

      next: (data) => {
        this.classes = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectClass(taxClass: Clase) {

    this.selectedClass = taxClass;

    this.selectedOrder = undefined;
    this.selectedFamily = undefined;
    this.selectedGenus = undefined;
    this.selectedSpecies = undefined;
    this.orders = [];
    this.families = [];
    this.genera = [];
    this.species = [];

    this.loading = true;

    this.categoryService.listOrders(taxClass.id_clase).subscribe({

      next: (data) => {
        this.orders = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectOrder(order: Orden) {

    this.selectedOrder = order;

    this.selectedFamily = undefined;
    this.selectedGenus = undefined;
    this.selectedSpecies = undefined;
    this.families = [];
    this.genera = [];
    this.species = [];

    this.loading = true;

    this.categoryService.listFamilies(order.id_orden).subscribe({

      next: (data) => {
        this.families = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectFamily(family: Familia) {

    this.selectedFamily = family;

    this.selectedGenus = undefined;
    this.selectedSpecies = undefined;
    this.genera = [];
    this.species = [];

    this.loading = true;

    this.categoryService.listGenera(family.id_familia).subscribe({

      next: (data) => {
        this.genera = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectGenus(genus: Genero) {

    this.selectedGenus = genus;

    this.selectedSpecies = undefined;
    this.species = [];

    this.loading = true;

    this.categoryService.listSpecies(genus.id_genero).subscribe({

      next: (data) => {
        this.species = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectSpecies(species: Especie) {

    this.selectedSpecies = species;

  }

  save() {

    if (this.form.invalid || !this.selectedSpecies) {

      this.form.markAllAsTouched();

      return;

    }

    const result = {
      ...this.form.value,
      id_especie: this.selectedSpecies.id_especie
    };

    this.dialogRef.close(result);

  }

  cancel() {

    this.dialogRef.close();

  }

}
