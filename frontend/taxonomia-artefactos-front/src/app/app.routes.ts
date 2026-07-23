import { Routes } from '@angular/router';

import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ArtefactosComponent } from './pages/artefactos/artefactos.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'usuarios',
        pathMatch: 'full'
    },

    {
        path: 'usuarios',
        component: UsuariosComponent
    },

    {
        path: 'artefactos',
        component: ArtefactosComponent
    }

];