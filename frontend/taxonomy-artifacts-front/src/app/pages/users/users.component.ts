import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { UserTypeService } from '../../services/user-type.service';
import { User } from '../../models/user';
import { UserType } from '../../models/user-type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { UserFormComponent } from '../../components/user-form/user-form.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  users:User[]=[];

  userTypes: UserType[] = [];

  displayedColumns=[
    'name',
    'email',
    'type',
    'actions'
  ];

  constructor(
    private userService: UserService,
    private userTypeService: UserTypeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {

    this.listUsers();

    this.loadUserTypes();

  }

  listUsers(){

    this.userService.list().subscribe({

      next:(data)=>{

        this.users=data;

      },

      error:(e)=>console.log(e)

    });

  }

  loadUserTypes() {

    this.userTypeService.list().subscribe({

      next: (types) => {

        this.userTypes = types;

      },

      error: () => {}

    });

  }

  // Shows the type's name instead of its id. While the types are still
  // loading it returns an empty text; if a type is not found, it falls
  // back to the id so nothing is silently hidden.
  userTypeName(idUserType: number): string {

    if (!this.userTypes.length) return '';

    const type = this.userTypes.find(t => t.id_user_type === idUserType);

    return type ? type.name : String(idUserType);

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
            this.translate.instant('USERS.CREATED'),
            this.translate.instant('USERS.CLOSE'),
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            this.translate.instant('USERS.CREATE_ERROR'),
            this.translate.instant('USERS.CLOSE'),
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
        user.id_user!,
        result
      ).subscribe({

        next: () => {

          this.listUsers();

          this.snackBar.open(
            this.translate.instant('USERS.UPDATED'),
            this.translate.instant('USERS.CLOSE'),
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            this.translate.instant('USERS.UPDATE_ERROR'),
            this.translate.instant('USERS.CLOSE'),
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  delete(user: User) {

    const confirmText = this.translate.instant('USERS.CONFIRM_DELETE', { name: user.username });

    if (!confirm(confirmText)) return;

    this.userService.delete(user.id_user!).subscribe({

      next: () => {

        this.listUsers();

        this.snackBar.open(
          this.translate.instant('USERS.DELETED'),
          this.translate.instant('USERS.CLOSE'),
          {
            duration: 3000
          }
        );

      },

      error: () => {

        this.snackBar.open(
          this.translate.instant('USERS.DELETE_ERROR'),
          this.translate.instant('USERS.CLOSE'),
          {
            duration: 3000
          }
        );

      }

    });

  }

}