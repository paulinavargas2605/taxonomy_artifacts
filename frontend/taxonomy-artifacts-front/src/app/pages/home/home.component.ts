import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  levels = [
    'DOMAIN',
    'KINGDOM',
    'PHYLUM',
    'CLASS',
    'ORDER',
    'FAMILY',
    'GENUS',
    'SPECIES'
  ];

}