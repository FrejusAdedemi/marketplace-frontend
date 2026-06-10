import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../services/product';
import { Product, ProductSort } from '../../models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';

type LoadState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss'
})
export class Catalog implements OnInit {
  products: Product[] = [];
  state: LoadState = 'loading';

  search = '';
  category = '';
  sort: ProductSort = 'created_at_desc';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  page = 1;
  readonly limit = 12;
  total = 0;
  totalPages = 1;

  private searchChanged = new Subject<void>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.searchChanged.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.page = 1;
      this.loadProducts();
    });
    this.loadProducts();
  }

  onSearchChange(): void {
    this.searchChanged.next();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadProducts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.loadProducts();
  }

  /**
   * Filtre prix appliqué côté front : l'API /api/products ne propose pas de
   * paramètre de plage de prix dans son contrat (page, limit, category, search, sort).
   */
  get filteredProducts(): Product[] {
    return this.products.filter((product) => {
      if (this.minPrice != null && product.price < this.minPrice) return false;
      if (this.maxPrice != null && product.price > this.maxPrice) return false;
      return true;
    });
  }

  private loadProducts(): void {
    this.state = 'loading';
    this.productService
      .getProducts({
        page: this.page,
        limit: this.limit,
        search: this.search.trim() || undefined,
        category: this.category.trim() || undefined,
        sort: this.sort
      })
      .subscribe({
        next: (result) => {
          this.products = result.products;
          this.total = result.total;
          this.totalPages = result.totalPages;
          this.state = 'success';
        },
        error: () => {
          this.products = [];
          this.state = 'error';
        }
      });
  }
}
