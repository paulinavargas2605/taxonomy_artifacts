import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';

import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatMenuModule,
    TranslatePipe
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  currentLang = 'en';

  currentUser$: Observable<User | null>;

  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {

    this.currentUser$ = this.authService.currentUser$;

  }

  ngOnInit(): void {

    const savedLang = localStorage.getItem('lang');

    this.currentLang = savedLang || 'en';

    this.translate.use(this.currentLang);

  }

  onLanguageToggle(checked: boolean) {

    this.currentLang = checked ? 'es' : 'en';

    this.translate.use(this.currentLang);

    localStorage.setItem('lang', this.currentLang);

  }

  logout() {

    this.authService.logout();

  }

}