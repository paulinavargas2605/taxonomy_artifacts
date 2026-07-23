import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { Artefacto } from '../../models/artefacto';
import { ArtefactoService } from '../../services/artefacto.service';

import { ArtefactoFormComponent } from '../../components/artefacto-form/artefacto-form.component';

@Component({
  selector: 'app-artefactos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './artefactos.component.html',
  styleUrl: './artefactos.component.css'
})
export class ArtefactosComponent implements OnInit {

  artefactos: Artefacto[] = [];

  displayedColumns = [
    'id',
    'nombre',
    'usuario',
    'imagen',
    'activo',
    'acciones'
  ];

  constructor(
    private artefactoService: ArtefactoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.listarArtefactos();

  }

  listarArtefactos() {

    this.artefactoService.listar().subscribe({

      next: (data) => {

        this.artefactos = data;

      },

      error: (e) => console.log(e)

    });

  }

  nuevoArtefacto() {

    const dialog = this.dialog.open(ArtefactoFormComponent, {

      width: '550px'

    });

    dialog.afterClosed().subscribe(resultado => {

      if (!resultado) return;

      this.artefactoService.crear(resultado).subscribe({

        next: () => {

          this.listarArtefactos();

          this.snackBar.open(
            'Artefacto creado correctamente',
            'Cerrar',
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            'Error al crear el artefacto',
            'Cerrar',
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  editar(artefacto: Artefacto) {

    const dialog = this.dialog.open(ArtefactoFormComponent, {

      width: '550px',

      data: artefacto

    });

    dialog.afterClosed().subscribe(resultado => {

      if (!resultado) return;

      this.artefactoService.actualizar(
        artefacto.id_artefacto!,
        resultado
      ).subscribe({

        next: () => {

          this.listarArtefactos();

          this.snackBar.open(
            'Artefacto actualizado',
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

  eliminar(artefacto: Artefacto) {

    if (!confirm(`¿Eliminar "${artefacto.nombre}"?`))
      return;

    this.artefactoService.eliminar(
      artefacto.id_artefacto!
    ).subscribe({

      next: () => {

        this.listarArtefactos();

        this.snackBar.open(
          'Artefacto eliminado',
          'Cerrar',
          {
            duration: 3000
          }
        );

      },

      error: () => {

        this.snackBar.open(
          'No fue posible eliminar',
          'Cerrar',
          {
            duration: 3000
          }
        );

      }

    });

  }

}