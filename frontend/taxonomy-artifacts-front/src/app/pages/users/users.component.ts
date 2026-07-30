import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  users:User[]=[];

  displayedColumns=[
    'id',
    'name',
    'email',
    'type',
    'actions'
  ];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.listUsers();

  }

  listUsers(){

    this.userService.list().subscribe({

      next:(data)=>{

        this.users=data;

      },

      error:(e)=>console.log(e)

    });

  }

  newUser() {

    const dialog = this.dialog.open(UserFormComponent, {
      width: '500px'
    });

    dialog.afterClosed().subscribe(result => {

      if (!result) return;

      this.userService.create(result).subscribe({

        next: () => {

          this.listUsers();

          this.snackBar.open(
            'User created successfully',
            'Close',
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            'Could not create the user',
            'Close',
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  edit(user: User) {

    const dialog = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: user
    });

    dialog.afterClosed().subscribe(result => {

      if (!result) return;

      this.userService.update(
        user.id_usuario!,
        result
      ).subscribe({

        next: () => {

          this.listUsers();

          this.snackBar.open(
            'User updated',
            'Close',
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            'Error updating',
            'Close',
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  delete(user: User) {

    if (!confirm(`Delete ${user.nombre_usuario}?`)) return;

    this.userService.delete(user.id_usuario!).subscribe({

      next: () => {

        this.listUsers();

        this.snackBar.open(
          'User deleted',
          'Close',
          {
            duration: 3000
          }
        );

      },

      error: () => {

        this.snackBar.open(
          'Could not delete the user',
          'Close',
          {
            duration: 3000
          }
        );

      }

    });

  }

}
