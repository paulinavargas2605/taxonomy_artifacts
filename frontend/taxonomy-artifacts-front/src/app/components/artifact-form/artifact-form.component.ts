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
import { Phylum, TaxonomicClass, Order, Family, Genus, Species } from '../../models/category';
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
  phyla: Phylum[] = [];
  classes: TaxonomicClass[] = [];
  orders: Order[] = [];
  families: Family[] = [];
  genera: Genus[] = [];
  species: Species[] = [];

  // current selection at each level
  selectedPhylum?: Phylum;
  selectedClass?: TaxonomicClass;
  selectedOrder?: Order;
  selectedFamily?: Family;
  selectedGenus?: Genus;
  selectedSpecies?: Species;

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

      name: ['', Validators.required],

      description: [''],

      id_user: ['', Validators.required],

      image_url: [''],

      active: [true]

    });

    if (data) {

      this.editMode = true;

      this.form.patchValue(data);

      // in edit mode a species is already assigned; it is kept
      // even if the user doesn't repeat the taxonomy walkthrough
      this.selectedSpecies = { id_species: data.id_species, name: '' };

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

  selectPhylum(phylum: Phylum) {

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

    this.categoryService.listClasses(phylum.id_phylum).subscribe({

      next: (data) => {
        this.classes = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectClass(taxClass: TaxonomicClass) {

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

    this.categoryService.listOrders(taxClass.id_class).subscribe({

      next: (data) => {
        this.orders = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectOrder(order: Order) {

    this.selectedOrder = order;

    this.selectedFamily = undefined;
    this.selectedGenus = undefined;
    this.selectedSpecies = undefined;
    this.families = [];
    this.genera = [];
    this.species = [];

    this.loading = true;

    this.categoryService.listFamilies(order.id_order).subscribe({

      next: (data) => {
        this.families = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectFamily(family: Family) {

    this.selectedFamily = family;

    this.selectedGenus = undefined;
    this.selectedSpecies = undefined;
    this.genera = [];
    this.species = [];

    this.loading = true;

    this.categoryService.listGenera(family.id_family).subscribe({

      next: (data) => {
        this.genera = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectGenus(genus: Genus) {

    this.selectedGenus = genus;

    this.selectedSpecies = undefined;
    this.species = [];

    this.loading = true;

    this.categoryService.listSpecies(genus.id_genus).subscribe({

      next: (data) => {
        this.species = data;
        this.loading = false;
      },

      error: () => {
        this.loading = false;
      }

    });

  }

  selectSpecies(species: Species) {

    this.selectedSpecies = species;

  }

  save() {

    if (this.form.invalid || !this.selectedSpecies) {

      this.form.markAllAsTouched();

      return;

    }

    const result = {
      ...this.form.value,
      id_species: this.selectedSpecies.id_species
    };

    this.dialogRef.close(result);

  }

  cancel() {

    this.dialogRef.close();

  }

}
