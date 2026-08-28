import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { ArtifactsComponent } from './pages/artifacts/artifacts.component';
import { ArtifactDetailComponent } from './pages/artifact-detail/artifact-detail.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'artifacts',
        pathMatch: 'full'
    },

    {
        path: 'login',
        component: LoginComponent
    },

    {
        path: 'home',
        component: HomeComponent
    },

    {
        path: 'users',
        component: UsersComponent
    },

    {
        path: 'artifacts',
        component: ArtifactsComponent
    },

    {
        path: 'artifacts/:id',
        component: ArtifactDetailComponent
    }

];