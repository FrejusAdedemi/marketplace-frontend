import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.css'
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  search = '';
  category = '';
  sort = 'created_at_desc';
  errorMessage = '';

  page = 1;
  limit = 20;
  totalPages = 1;
  totalProducts = 0;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.errorMessage = '';

    const filters: any = {
      page: this.page,
      limit: this.limit,
      sort: this.sort || 'created_at_desc'
    };

    if (this.search.trim()) {
      filters.search = this.search.trim();
    }

    if (this.category.trim()) {
      filters.category = this.category.trim();
    }

    this.productService.getProducts(filters).subscribe({
      next: (response: any) => {
        console.log('Catalogue API response:', response);

        this.products = [...this.extractProducts(response)];

        this.totalPages =
          response?.pagination?.pages ||
          response?.totalPages ||
          1;

        this.totalProducts =
          response?.pagination?.total ||
          response?.total ||
          this.products.length;

        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur catalogue:', error);

        this.products = [];
        this.errorMessage = 'Impossible de charger les produits.';
        this.cdr.detectChanges();
      }
    });
  }

  extractProducts(response: any): Product[] {
    if (Array.isArray(response?.products)) return response.products;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadProducts();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.search = '';
    this.category = '';
    this.sort = 'created_at_desc';
    this.page = 1;
    this.loadProducts();
  }

  getProductId(product: Product): string {
    return String(product?._id || product?.id || '');
  }

  getProductName(product: Product): string {
    return product?.name || 'Produit sans nom';
  }

  getProductDescription(product: Product): string {
    return product?.description || 'Aucune description disponible.';
  }

  getProductCategory(product: Product): string {
    return product?.category || 'Non classé';
  }

  getProductPrice(product: Product): string {
    const price = Number(product?.price ?? 0);
    return `${price.toFixed(2)} €`;
  }

  getProductImage(product: Product): string {
    if (Array.isArray(product?.images) && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }

    return 'https://placehold.co/600x400?text=Produit';
  }

  get canManageProducts(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin' || role === 'store_manager';
  }
}