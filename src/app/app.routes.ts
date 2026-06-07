import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'profil',
    loadComponent: () => import('./pages/profil/profil').then(m => m.Profil),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];