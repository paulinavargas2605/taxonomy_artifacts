import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, catchError } from 'rxjs';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Artifact, ClassifiedArtifact } from '../../models/artifact';
import { ArtifactService } from '../../services/artifact.service';
import { AuthService } from '../../services/auth.service';

import { ArtifactFormComponent } from '../../components/artifact-form/artifact-form.component';

type SearchField =
  | 'all'
  | 'name'
  | 'species'
  | 'genus'
  | 'family'
  | 'order'
  | 'class'
  | 'phylum';

@Component({
  selector: 'app-artifacts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './artifacts.component.html',
  styleUrl: './artifacts.component.css'
})
export class ArtifactsComponent implements OnInit {

  artifacts: Artifact[] = [];

  filteredArtifacts: Artifact[] = [];

  classifiedById = new Map<number, ClassifiedArtifact>();

  searchText = '';

  searchField: SearchField = 'all';

  filterOptions: { value: SearchField; labelKey: string }[] = [
    { value: 'all', labelKey: 'SEARCH.ALL' },
    { value: 'name', labelKey: 'SEARCH.NAME' },
    { value: 'species', labelKey: 'SEARCH.SPECIES' },
    { value: 'genus', labelKey: 'SEARCH.GENUS' },
    { value: 'family', labelKey: 'SEARCH.FAMILY' },
    { value: 'order', labelKey: 'SEARCH.ORDER' },
    { value: 'class', labelKey: 'SEARCH.CLASS' },
    { value: 'phylum', labelKey: 'SEARCH.PHYLUM' }
  ];

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

    forkJoin({

      artifacts: this.artifactService.list(),

      // If the classified endpoint is not available, the list still loads
      // and the search just works on artifact names.
      classified: this.artifactService.listClassified().pipe(
        catchError(() => of([] as ClassifiedArtifact[]))
      )

    }).subscribe({

      next: ({ artifacts, classified }) => {

        this.artifacts = artifacts;

        this.classifiedById = new Map(
          classified.map(c => [c.id_artifact, c] as [number, ClassifiedArtifact])
        );

        this.applyFilter();

      },

      error: (e) => console.log(e)

    });

  }

  // ---------- search ----------

  onSearchChange(value: string) {

    this.searchText = value;

    this.applyFilter();

  }

  clearSearch() {

    this.onSearchChange('');

  }

  setSearchField(field: SearchField) {

    this.searchField = field;

    this.applyFilter();

  }

  private normalize(text: string | null | undefined): string {

    return (text ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  }

  private valuesFor(
    artifact: Artifact,
    c: ClassifiedArtifact | undefined
  ): (string | undefined)[] {

    switch (this.searchField) {

      case 'name':
        return [artifact.name];

      case 'species':
        return [c?.species, c?.species_es];

      case 'genus':
        return [c?.genus, c?.genus_es];

      case 'family':
        return [c?.family, c?.family_es];

      case 'order':
        return [c?.order_name, c?.order_name_es];

      case 'class':
        return [c?.class, c?.class_es];

      case 'phylum':
        return [c?.phylum, c?.phylum_es];

      default:
        return [
          artifact.name,
          c?.species, c?.species_es,
          c?.genus, c?.genus_es,
          c?.family, c?.family_es,
          c?.order_name, c?.order_name_es,
          c?.class, c?.class_es,
          c?.phylum, c?.phylum_es
        ];

    }

  }

  private applyFilter() {

    const query = this.normalize(this.searchText.trim());

    if (!query) {

      this.filteredArtifacts = this.artifacts;

      return;

    }

    this.filteredArtifacts = this.artifacts.filter(artifact => {

      const classified = this.classifiedById.get(artifact.id_artifact!);

      return this.valuesFor(artifact, classified)
        .some(value => this.normalize(value).includes(query));

    });

  }

  // ---------- session ----------

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

  // ---------- CRUD ----------

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