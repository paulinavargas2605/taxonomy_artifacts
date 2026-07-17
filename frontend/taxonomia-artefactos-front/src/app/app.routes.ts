import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ArtefactosComponent } from './pages/artefactos/artefactos.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'artefactos', component: ArtefactosComponent }
    ]
  }
];