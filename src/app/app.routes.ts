import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.Register),
  },
  {
    path: 'profil',
    loadComponent: () => import('./pages/profil/profil').then((m) => m.Profil),
    canActivate: [authGuard],
  },
  {
    // Réalisé par Laura — Route admin gestion utilisateurs (contrat §5.2)
    path: 'admin/users',
    loadComponent: () =>
      import('./pages/admin/users/admin-users').then((m) => m.AdminUsers),
    canActivate: [authGuard, roleGuard(['admin'])],
  },
  { path: '**', redirectTo: 'login' },
];
