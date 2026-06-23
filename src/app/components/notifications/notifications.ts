// Réalisé par Laura — Composant notifications temps réel (WebSocket)

import { Component, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';
import { WebSocketService } from '../../services/websocket.service';
import { WsEvent } from '../../models/ws-event.model';

interface Notification {
  id: number;
  message: string;
  level: 'info' | 'warning';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit, OnDestroy {
  protected readonly notifications = signal<Notification[]>([]);

  private eventSub: Subscription | null = null;
  private dismissTimers: ReturnType<typeof setTimeout>[] = [];

  constructor(
    protected readonly auth: AuthService,
    private ws: WebSocketService
  ) {
    // Réagit aux changements d'état d'authentification (login / logout)
    effect(() => {
      const user = this.auth.currentUser();
      const token = this.auth.getToken();
      if (user && token) {
        this.ws.connect(token, user.role);
      } else {
        this.ws.disconnect();
        this.clearAll();
      }
    });
  }

  ngOnInit(): void {
    this.eventSub = this.ws.events$.subscribe((event) => this.push(event));
  }

  ngOnDestroy(): void {
    this.eventSub?.unsubscribe();
    this.dismissTimers.forEach(clearTimeout);
    this.ws.disconnect();
  }

  dismiss(id: number): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  private push(event: WsEvent): void {
    const id = Date.now() + Math.random(); // évite les collisions si deux événements arrivent la même ms
    const notif: Notification = {
      id,
      message: this.toMessage(event),
      level: event.type === 'stock.low' ? 'warning' : 'info',
    };
    this.notifications.update((list) => [notif, ...list].slice(0, 5));

    const timer = setTimeout(() => this.dismiss(id), 5_000);
    this.dismissTimers.push(timer);
  }

  private clearAll(): void {
    this.notifications.set([]);
    this.dismissTimers.forEach(clearTimeout);
    this.dismissTimers = [];
  }

  private toMessage(event: WsEvent): string {
    switch (event.type) {
      case 'order.created':
        return `Commande ${event.order_id} créée (en attente)`;
      case 'order.confirmed':
        return `Commande ${event.order_id} confirmée`;
      case 'order.cancelled':
        return `Commande ${event.order_id} annulée`;
      case 'order.shipped':
        return `Commande ${event.order_id} expédiée`;
      case 'order.delivered':
        return `Commande ${event.order_id} livrée`;
      case 'stock.low':
        return `Alerte stock faible — produit ${event.product_id} (magasin ${event.store_id})`;
    }
  }
}
