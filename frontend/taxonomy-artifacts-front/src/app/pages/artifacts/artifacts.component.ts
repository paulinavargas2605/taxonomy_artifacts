import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Artifact } from '../../models/artifact';
import { ArtifactService } from '../../services/artifact.service';

import { ArtifactFormComponent } from '../../components/artifact-form/artifact-form.component';

@Component({
  selector: 'app-artifacts',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './artifacts.component.html',
  styleUrl: './artifacts.component.css'
})
export class ArtifactsComponent implements OnInit {

  artifacts: Artifact[] = [];

  displayedColumns = [
    'id',
    'name',
    'user',
    'image',
    'active',
    'actions'
  ];

  constructor(
    private readonly artifactService: ArtifactService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {

    this.listArtifacts();

  }

  listArtifacts() {

    this.artifactService.list().subscribe({

      next: (data) => {

        this.artifacts = data;

      },

      error: (e) => console.log(e)

    });

  }

  newArtifact() {

    const dialog = this.dialog.open(ArtifactFormComponent, {

      width: '850px',

      maxWidth: '95vw'

    });

    dialog.afterClosed().subscribe(result => {

      if (!result) return;

      this.artifactService.create(result).subscribe({

        next: () => {

          this.listArtifacts();

          this.snackBar.open(
            'Artifact created successfully',
            'Close',
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            'Error creating the artifact',
            'Close',
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  edit(artifact: Artifact) {

    const dialog = this.dialog.open(ArtifactFormComponent, {

      width: '850px',

      maxWidth: '95vw',

      data: artifact

    });

    dialog.afterClosed().subscribe(result => {

      if (!result) return;

      this.artifactService.update(
        artifact.id_artifact!,
        result
      ).subscribe({

        next: () => {

          this.listArtifacts();

          this.snackBar.open(
            'Artifact updated',
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

  delete(artifact: Artifact) {

    if (!confirm(`Delete "${artifact.name}"?`))
      return;

    this.artifactService.delete(
      artifact.id_artifact!
    ).subscribe({

      next: () => {

        this.listArtifacts();

        this.snackBar.open(
          'Artifact deleted',
          'Close',
          {
            duration: 3000
          }
        );

      },

      error: () => {

        this.snackBar.open(
          'Could not delete',
          'Close',
          {
            duration: 3000
          }
        );

      }

    });

  }

}
