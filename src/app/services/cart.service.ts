import { Injectable } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly key = 'marketplace_cart';

  getCart(): CartItem[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  saveCart(cart: CartItem[]): void {
    localStorage.setItem(this.key, JSON.stringify(cart));
  }

  addToCart(product: Product): void {
    const cart = this.getCart();
    const id = product._id || product.id;

    const existing = cart.find((item) => {
      return (item.product._id || item.product.id) === id;
    });

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }

    this.saveCart(cart);
  }

  removeFromCart(id: string): void {
    const cart = this.getCart().filter((item) => {
      return (item.product._id || item.product.id) !== id;
    });

    this.saveCart(cart);
  }

  clearCart(): void {
    localStorage.removeItem(this.key);
  }

  getTotal(): number {
    return this.getCart().reduce((total, item) => {
      return total + Number(item.product.price || 0) * item.quantity;
    }, 0);
  }
}