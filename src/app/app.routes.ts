import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { ProductCatalogComponent } from './pages/product-catalog/product-catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';

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

  { path: 'products/new', component: ProductFormComponent },
  { path: 'products', component: ProductCatalogComponent },
  { path: 'products/:id', component: ProductDetailComponent },

{ path: 'cart', component: CartComponent },
{ path: 'orders', component: OrdersComponent },

  { path: '**', redirectTo: 'home' }
];