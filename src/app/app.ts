import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth';
import { canManageProducts } from './models/product.model';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('marketplace-frontend');
  protected readonly canManageProducts = signal(false);

  constructor(protected authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getMe().subscribe({
        next: (user) => this.canManageProducts.set(canManageProducts(user?.role)),
        error: () => this.canManageProducts.set(false)
      });
    }
  }

  onLogout(): void {
    this.authService.logout();
  }
}
