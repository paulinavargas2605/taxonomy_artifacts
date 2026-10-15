import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Artifact } from '../../models/artifact';
import { ArtifactService } from '../../services/artifact.service';
import { AuthService } from '../../services/auth.service';

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
    MatMenuModule,
    TranslatePipe
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
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {

    this.listArtifacts();

    const openNew = this.route.snapshot.queryParamMap.get('openNew');

    if (openNew === 'true') {
      this.newArtifact();
    }

  }

  viewDetail(artifact: Artifact) {

    this.router.navigate(['/artifacts', artifact.id_artifact]);

  }

  listArtifacts() {

    this.artifactService.list().subscribe({

      next: (data) => {

        this.artifacts = data;

      },

      error: (e) => console.log(e)

    });

  }

  // Returns true if there is an active session. Otherwise sends the
  // person to the login page and returns false.
  private requireLogin(redirect?: string): boolean {

    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(
      ['/login'],
      redirect ? { queryParams: { redirect } } : {}
    );

    return false;

  }

  newArtifact() {

    if (!this.requireLogin('new-artifact')) return;

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
            this.translate.instant('ARTIFACTS.CREATED'),
            this.translate.instant('ARTIFACTS.CLOSE'),
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            this.translate.instant('ARTIFACTS.CREATE_ERROR'),
            this.translate.instant('ARTIFACTS.CLOSE'),
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  edit(artifact: Artifact) {

    if (!this.requireLogin()) return;

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
            this.translate.instant('ARTIFACTS.UPDATED'),
            this.translate.instant('ARTIFACTS.CLOSE'),
            {
              duration: 3000
            }
          );

        },

        error: () => {

          this.snackBar.open(
            this.translate.instant('ARTIFACTS.UPDATE_ERROR'),
            this.translate.instant('ARTIFACTS.CLOSE'),
            {
              duration: 3000
            }
          );

        }

      });

    });

  }

  delete(artifact: Artifact) {

    if (!this.requireLogin()) return;

    const confirmText = this.translate.instant('ARTIFACTS.CONFIRM_DELETE', { name: artifact.name });

    if (!confirm(confirmText))
      return;

    this.artifactService.delete(
      artifact.id_artifact!
    ).subscribe({

      next: () => {

        this.listArtifacts();

        this.snackBar.open(
          this.translate.instant('ARTIFACTS.DELETED'),
          this.translate.instant('ARTIFACTS.CLOSE'),
          {
            duration: 3000
          }
        );

      },

      error: () => {

        this.snackBar.open(
          this.translate.instant('ARTIFACTS.DELETE_ERROR'),
          this.translate.instant('ARTIFACTS.CLOSE'),
          {
            duration: 3000
          }
        );

      }

    });

  }

}