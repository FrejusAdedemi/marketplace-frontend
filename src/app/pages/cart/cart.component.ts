import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.items = [...this.cartService.getCart()];
    this.cdr.detectChanges();
  }

  remove(id: string): void {
    this.cartService.removeFromCart(id);
    this.refresh();
  }

  clear(): void {
    this.cartService.clearCart();
    this.refresh();
  }

  total(): string {
    return `${this.cartService.getTotal().toFixed(2)} €`;
  }

  getId(item: CartItem): string {
    return String(item.product._id || item.product.id || '');
  }

  checkout(): void {
const token = localStorage.getItem('access_token');

if (!token) {
  alert('Vous devez être connecté pour passer commande.');
  return;
}
    if (this.items.length === 0) {
      alert('Votre panier est vide.');
      return;
    }

    const orderItems = this.items.map((item) => ({
      product_id: String(item.product._id || item.product.id),
      store_id: String(item.product.attributes?.store_id || 'default-store'),
      quantity: item.quantity,
      unit_price: Number(item.product.price || 0)
    }));

    this.orderService.createOrder(orderItems).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.refresh();
        alert('Commande créée avec succès.');
      },
      error: (error) => {
        console.error('Erreur création commande :', error);
        alert('Commande impossible. Vérifiez le stock ou le magasin associé.');
      }
    });
  }
}