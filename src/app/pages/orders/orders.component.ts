import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage = '';

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (response: any) => {
        this.orders = Array.isArray(response?.orders)
          ? response.orders
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.orders = [];
        this.errorMessage = 'Impossible de charger les commandes.';
        this.cdr.detectChanges();
      }
    });
  }

  cancelOrder(id: string): void {
    this.orderService.cancelOrder(id).subscribe({
      next: () => this.loadOrders(),
      error: () => this.errorMessage = 'Impossible d’annuler la commande.'
    });
  }
}