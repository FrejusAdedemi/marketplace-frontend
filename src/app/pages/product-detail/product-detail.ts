import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product';
import { AuthService } from '../../services/auth';
import { Product, canManageProducts } from '../../models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';

type LoadState = 'loading' | 'success' | 'error' | 'not-found';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCard],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  suggestions: Product[] = [];
  state: LoadState = 'loading';
  suggestionsLoading = true;
  canManage = false;
  deleting = false;
  deleteError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.state = 'not-found';
      return;
    }

    this.loadProduct(id);
    this.loadSuggestions(id);
    this.checkPermissions();
  }

  onDelete(): void {
    if (!this.product) return;
    const confirmed = confirm(`Supprimer définitivement "${this.product.name}" ?`);
    if (!confirmed) return;

    this.deleting = true;
    this.deleteError = '';

    this.productService.deleteProduct(this.product._id).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.deleting = false;
        this.deleteError = 'Erreur lors de la suppression du produit.';
      }
    });
  }

  private loadProduct(id: string): void {
    this.state = 'loading';
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.state = 'success';
      },
      error: (err) => {
        this.state = err?.status === 404 ? 'not-found' : 'error';
      }
    });
  }

  private loadSuggestions(id: string): void {
    this.suggestionsLoading = true;
    this.productService.getSuggestions(id).subscribe({
      next: (products) => {
        this.suggestions = products;
        this.suggestionsLoading = false;
      },
      error: () => {
        this.suggestions = [];
        this.suggestionsLoading = false;
      }
    });
  }

  private checkPermissions(): void {
    if (!this.authService.isLoggedIn()) return;

    this.authService.getMe().subscribe({
      next: (user) => (this.canManage = canManageProducts(user?.role)),
      error: () => (this.canManage = false)
    });
  }
}
