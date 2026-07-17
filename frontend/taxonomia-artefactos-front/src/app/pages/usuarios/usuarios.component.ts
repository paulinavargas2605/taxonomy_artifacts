import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario';

import { UsuarioFormComponent } from '../../components/usuario-form/usuario-form.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule
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
    private usuarioService:UsuarioService,
    private dialog:MatDialog
  ){}

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

  nuevoUsuario(){

    const dialog=this.dialog.open(UsuarioFormComponent,{

      width:'500px'

    });

    dialog.afterClosed().subscribe(resultado=>{

      if(resultado){

        this.usuarioService.crear(resultado).subscribe({

          next:()=>{

            this.listarUsuarios();

          }

        });

      }

    });

  }

  editar(usuario: Usuario) {

    const dialog = this.dialog.open(UsuarioFormComponent, {
      width: '500px',
      data: usuario
    });

    dialog.afterClosed().subscribe(resultado => {

      if (resultado) {

        this.usuarioService.actualizar(
          usuario.id_usuario!,
          resultado
        ).subscribe({

          next: () => {

            this.listarUsuarios();

          },

          error: (e) => console.error(e)

        });

      }

    });

  }

  eliminar(usuario: Usuario) {

    const confirmar = confirm(
      `¿Deseas eliminar al usuario "${usuario.nombre_usuario}"?`
    );

    if (!confirmar) return;

    this.usuarioService.eliminar(
      usuario.id_usuario!
    ).subscribe({

      next: () => {

        this.listarUsuarios();

      },

      error: (e) => console.error(e)

    });

  }

}