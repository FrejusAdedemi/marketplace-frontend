import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get role(): string {
    return localStorage.getItem('role') || 'visitor';
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get canManageProducts(): boolean {
    return this.role === 'store_manager' || this.role === 'admin';
  }

  get roleLabel(): string {
    if (!this.isLoggedIn) return 'Visiteur';
    if (this.role === 'admin') return 'Admin';
    if (this.role === 'store_manager') return 'Vendeur';
    if (this.role === 'customer') return 'Client';
    return this.role;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    window.location.href = '/home';
  }
}