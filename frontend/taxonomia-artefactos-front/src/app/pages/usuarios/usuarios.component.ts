import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{

  usuarios:Usuario[]=[];

  displayedColumns=[
    'id',
    'nombre',
    'correo',
    'tipo',
    'acciones'
  ];

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.listarUsuarios();

  }

  listarUsuarios(){

    this.usuarioService.listar().subscribe({

      next:(data)=>{

        this.usuarios=data;

      },

      error:(e)=>console.log(e)

    });

  }

  nuevoUsuario() {

    const dialog = this.dialog.open(UsuarioFormComponent, {
      width: '500px'
    });

    dialog.afterClosed().subscribe(resultado => {

      if (!resultado) return;

      this.usuarioService.crear(resultado).subscribe({

        next: () => {

          this.listarUsuarios();

          this.snackBar.open(
            'Usuario creado correctamente',
            'Cerrar',
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            'No fue posible crear el usuario',
            'Cerrar',
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  editar(usuario: Usuario) {

    const dialog = this.dialog.open(UsuarioFormComponent, {
      width: '500px',
      data: usuario
    });

    dialog.afterClosed().subscribe(resultado => {

      if (!resultado) return;

      this.usuarioService.actualizar(
        usuario.id_usuario!,
        resultado
      ).subscribe({

        next: () => {

          this.listarUsuarios();

          this.snackBar.open(
            'Usuario actualizado',
            'Cerrar',
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            'Error al actualizar',
            'Cerrar',
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  eliminar(usuario: Usuario) {

    if (!confirm(`¿Eliminar a ${usuario.nombre_usuario}?`)) return;

    this.usuarioService.eliminar(usuario.id_usuario!).subscribe({

      next: () => {

        this.listarUsuarios();

        this.snackBar.open(
          'Usuario eliminado',
          'Cerrar',
          {
            duration: 3000
          }
        );

      },

      error: () => {

        this.snackBar.open(
          'No fue posible eliminar el usuario',
          'Cerrar',
          {
            duration: 3000
          }
        );

      }

    });

  }

}