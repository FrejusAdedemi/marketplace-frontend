import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  suggestions: Product[] = [];
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          if (!id) {
            throw new Error('Produit introuvable.');
          }

          this.loadSuggestions(id);
          return this.productService.getProduct(id);
        })
      )
      .subscribe({
  next: (response: any) => {
    console.log('Produit reçu :', response);

    if (response.product) {
      this.product = response.product;
    } else {
      this.product = response;
    }

    console.log('Produit affiché :', this.product);
    this.errorMessage = '';
  },
  error: () => {
    this.product = null;
    this.errorMessage = 'Impossible de charger le produit.';
  }
});
  }

  loadSuggestions(id: string): void {
    this.productService.getSuggestions(id).subscribe({
      next: (products) => {
        this.suggestions = products || [];
      },
      error: () => {
        this.suggestions = [];
      }
    });
  }
}