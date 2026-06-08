import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-catalog.component.html'
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  search = '';
  category = '';
  sort = 'created_at_desc';
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
  this.productService.getProducts({
    page: 1,
    limit: 20,
    search: this.search.trim(),
    category: this.category.trim(),
    sort: this.sort
  }).subscribe({
    next: (response) => {
      console.log('Produits reçus :', response);

      if (Array.isArray(response)) {
        this.products = response;
      } else if (Array.isArray(response.products)) {
        this.products = response.products;
      } else {
        this.products = [];
      }

      console.log('Produits affichés :', this.products);
      this.errorMessage = '';
    },
    error: (error) => {
      console.error('Erreur chargement produits :', error);
      this.products = [];
      this.errorMessage = 'Impossible de charger les produits.';
    }
  });
}

  applyFilters(): void {
    this.loadProducts();
  }
}