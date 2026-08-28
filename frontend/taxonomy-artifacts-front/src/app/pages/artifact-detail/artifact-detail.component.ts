import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { TranslatePipe } from '@ngx-translate/core';

import { Artifact, ClassifiedArtifact } from '../../models/artifact';
import { User } from '../../models/user';

import { ArtifactService } from '../../services/artifact.service';
import { UserService } from '../../services/user.service';
import { LocalizedNamePipe } from '../../pipes/localized-name.pipe';

@Component({
  selector: 'app-artifact-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TranslatePipe,
    LocalizedNamePipe
  ],
  templateUrl: './artifact-detail.component.html',
  styleUrl: './artifact-detail.component.css'
})
export class ArtifactDetailComponent implements OnInit {

  artifact?: Artifact;
  classified?: ClassifiedArtifact;
  user?: User;

  loading = true;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private artifactService: ArtifactService,
    private userService: UserService
  ) {}

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    const id = Number(idParam);

    this.artifactService.get(id).subscribe({

      next: (artifact) => {

        this.artifact = artifact;

        this.userService.get(artifact.id_user).subscribe({
          next: (user) => { this.user = user; },
          error: () => {}
        });

        this.loading = false;

      },

      error: () => {
        this.notFound = true;
        this.loading = false;
      }

    });

    this.artifactService.getClassified(id).subscribe({
      next: (classified) => { this.classified = classified; },
      error: () => {}
    });

  }

}