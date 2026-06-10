import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';

type SectionState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  sponsoredProducts: Product[] = [];
  bestSellers: Product[] = [];
  sponsoredState: SectionState = 'loading';
  bestSellersState: SectionState = 'loading';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadSponsored();
    this.loadBestSellers();
  }

  private loadSponsored(): void {
    this.sponsoredState = 'loading';
    this.productService.getSponsoredProducts().subscribe({
      next: (products) => {
        this.sponsoredProducts = products;
        this.sponsoredState = 'success';
      },
      error: () => (this.sponsoredState = 'error')
    });
  }

  private loadBestSellers(): void {
    this.bestSellersState = 'loading';
    this.productService.getBestSellers().subscribe({
      next: (products) => {
        this.bestSellers = products;
        this.bestSellersState = 'success';
      },
      error: () => (this.bestSellersState = 'error')
    });
  }
}
