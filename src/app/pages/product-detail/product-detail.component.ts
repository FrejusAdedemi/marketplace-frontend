import { CartService } from '../../services/cart.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  suggestions: Product[] = [];
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');

      if (!id) {
        this.product = null;
        this.errorMessage = 'Produit introuvable.';
        this.cdr.detectChanges();
        return;
      }

      this.loadProduct(id);
      this.loadSuggestions(id);
    });
  }

  loadProduct(id: string): void {
    this.errorMessage = '';
    this.product = null;

    this.productService.getProduct(id).subscribe({
      next: (response: any) => {
        console.log('Produit API response:', response);

        const product = this.extractProduct(response);

        if (!product) {
          this.errorMessage = 'Produit introuvable.';
          this.cdr.detectChanges();
          return;
        }

        this.product = { ...product };
        this.errorMessage = '';

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur fiche produit:', error);

        this.product = null;
        this.errorMessage = 'Impossible de charger ce produit.';

        this.cdr.detectChanges();
      }
    });
  }

  loadSuggestions(id: string): void {
    this.productService.getSuggestions(id).subscribe({
      next: (response: any) => {
        console.log('Suggestions API response:', response);

        this.suggestions = [...this.extractProducts(response).filter((item) => {
          return this.getProductId(item) && this.getProductId(item) !== id;
        })];

        this.cdr.detectChanges();
      },
      error: () => {
        this.suggestions = [];
        this.cdr.detectChanges();
      }
    });
  }

  extractProduct(response: any): Product | null {
    if (response?.product) return response.product;
    if (response?.data && !Array.isArray(response.data)) return response.data;
    if (response?._id || response?.id) return response;
    return null;
  }

  extractProducts(response: any): Product[] {
    if (Array.isArray(response?.products)) return response.products;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response)) return response;
    return [];
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

    return 'https://placehold.co/800x500?text=Produit';
  }

  addToCart(): void {
  if (!this.product) return;
  this.cartService.addToCart(this.product);
  alert('Produit ajouté au panier.');
}
}