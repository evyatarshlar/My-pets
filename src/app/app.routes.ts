import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { petResolver } from './resolvers/pet.resolver';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    },
    {
        path: 'progress',
        loadComponent: () => import('./pages/progress/progress.component').then(m => m.ProgressComponent),
    },
    {
        path: 'pets',
        loadComponent: () => import('./pages/pet-index/pet-index.component').then(m => m.PetIndexComponent),
        children: [
            {
                path: 'edit',
                loadComponent: () => import('./pages/pet-edit/pet-edit.component').then(m => m.PetEditComponent)
            },
            {
                path: 'edit/:id',
                loadComponent: () => import('./pages/pet-edit/pet-edit.component').then(m => m.PetEditComponent),
                resolve: { pet: petResolver }
            }

        ]
    },
    {
        path: 'pets/:id',
        loadComponent: () => import('./pages/pet-details/pet-details.component').then(m => m.PetDetailsComponent),
        canActivate: [authGuard],
        resolve: { pet: petResolver }
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];