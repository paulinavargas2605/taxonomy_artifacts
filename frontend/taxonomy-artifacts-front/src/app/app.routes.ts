import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { ArtifactsComponent } from './pages/artifacts/artifacts.component';
import { ArtifactDetailComponent } from './pages/artifact-detail/artifact-detail.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
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