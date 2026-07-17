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

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css'
})
export class UsuarioFormComponent {

  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsuarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){

    this.formulario=this.fb.group({

      nombre_usuario:['',Validators.required],

      correo:['',[Validators.required,Validators.email]],

      contrasena_hash:[''],

      id_tipo_usuario:['',Validators.required]

    });

    if(data){

      this.formulario.patchValue(data);

    }

  }

  guardar() {

    if (this.formulario.invalid) {

      this.formulario.markAllAsTouched();
      return;

    }

    const datos = { ...this.formulario.value };

    if (!datos.contrasena_hash) {

      delete datos.contrasena_hash;

    }

    this.dialogRef.close(datos);

  }

  cancelar(){

    this.dialogRef.close();

  }

}