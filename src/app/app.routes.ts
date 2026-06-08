import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { ProductCatalogComponent } from './pages/product-catalog/product-catalog.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'products/new', component: ProductFormComponent },
  { path: 'products', component: ProductCatalogComponent },
  { path: 'products/:id', component: ProductDetailComponent },

  { path: '**', redirectTo: '' }
];