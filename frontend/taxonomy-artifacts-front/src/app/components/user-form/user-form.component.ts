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
import { MatSelectModule } from '@angular/material/select';

import { UserType } from '../../models/user-type';
import { UserTypeService } from '../../services/user-type.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {

  form: FormGroup;

  userTypes: UserType[] = [];

  constructor(
    private fb: FormBuilder,
    private userTypeService: UserTypeService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){

    this.form=this.fb.group({

      username:['',Validators.required],

      email:['',[Validators.required,Validators.email]],

      password_hash:[''],

      id_user_type:['',Validators.required]

    });

    if(data){

      this.form.patchValue(data);

    }

  }

  ngOnInit(): void {

    this.userTypeService.list().subscribe({

      next: (types) => {

        this.userTypes = types;

      },

      error: () => {}

    });

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();
      return;

    }

    const data = { ...this.form.value };

    if (!data.password_hash) {

      delete data.password_hash;

    }

    this.dialogRef.close(data);

  }

  cancel(){

    this.dialogRef.close();

  }

}