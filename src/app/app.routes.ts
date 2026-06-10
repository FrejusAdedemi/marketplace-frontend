import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home)
  },
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
  {
    path: 'products/new',
    loadComponent: () => import('./pages/product-form/product-form').then(m => m.ProductForm),
    canActivate: [authGuard]
  },
  {
    path: 'products/:id/edit',
    loadComponent: () => import('./pages/product-form/product-form').then(m => m.ProductForm),
    canActivate: [authGuard]
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail').then(m => m.ProductDetail)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/catalog/catalog').then(m => m.Catalog)
  },
  { path: '**', redirectTo: 'home' }
];