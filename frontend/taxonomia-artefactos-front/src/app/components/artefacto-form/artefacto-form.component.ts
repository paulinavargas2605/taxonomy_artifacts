import { Component, Inject } from '@angular/core';
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

@Component({
  selector: 'app-artefacto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './artefacto-form.component.html',
  styleUrl: './artefacto-form.component.css'
})
export class ArtefactoFormComponent {

  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ArtefactoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.formulario = this.fb.group({

      nombre: ['', Validators.required],

      id_usuario: ['', Validators.required],

      url_imagen: [''],

      activo: [true]

    });

    if (data) {

      this.formulario.patchValue(data);

    }

  }

  guardar() {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();

      return;

    }

    this.dialogRef.close(this.formulario.value);

  }

  cancelar() {

    this.dialogRef.close();

  }

}