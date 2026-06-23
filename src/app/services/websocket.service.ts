// Réalisé par Laura — Service WebSocket temps réel (contrat §10)

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { WsEvent } from '../models/ws-event.model';
import { UserRole } from '../models/user.model';

type WsService = 'orders' | 'stocks';

/**
 * Gère les connexions WebSocket vers le relay du gateway.
 *
 * Arbitrage dual-connexion (cf. rapport PHASE 1 §5a) :
 *   - ?service=orders  → tous les authentifiés (événements order.*)
 *   - ?service=stocks  → store_manager et admin uniquement (stock.low)
 *
 * Reconnexion exponentielle : 1s, 2s, 4s … max 30s.
 * Codes qui bloquent la reconnexion : 4001 (token invalide), 4004 (service inconnu), 1000 (fermeture normale).
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private readonly wsBase = 'ws://localhost:8080/ws';

  private readonly eventsSubject = new Subject<WsEvent>();
  readonly events$ = this.eventsSubject.asObservable();

  private connections = new Map<WsService, WebSocket>();
  private reconnectTimers = new Map<WsService, ReturnType<typeof setTimeout>>();
  private currentToken: string | null = null;

  connect(token: string, role: UserRole): void {
    this.disconnect();
    this.currentToken = token;
    this.openConnection('orders');
    if (role === 'store_manager' || role === 'admin') {
      this.openConnection('stocks');
    }
  }

  disconnect(): void {
    this.reconnectTimers.forEach(clearTimeout);
    this.reconnectTimers.clear();
    this.connections.forEach((ws) => ws.close(1000));
    this.connections.clear();
    this.currentToken = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.eventsSubject.complete();
  }

  private openConnection(service: WsService, attempt = 0): void {
    if (!this.currentToken) return;

    const url = `${this.wsBase}?token=${encodeURIComponent(this.currentToken)}&service=${service}`;
    const ws = new WebSocket(url);
    this.connections.set(service, ws);

    ws.onmessage = ({ data }) => {
      try {
        this.eventsSubject.next(JSON.parse(data as string) as WsEvent);
      } catch {
        // Ignore les frames malformées
      }
    };

    ws.onclose = ({ code }) => {
      this.connections.delete(service);
      // 4001 = token invalide/révoqué, 4004 = paramètre service inconnu, 1000 = fermeture normale
      if (code === 4001 || code === 4004 || code === 1000) return;
      const delay = Math.min(30_000, 1_000 * 2 ** attempt);
      const timer = setTimeout(() => this.openConnection(service, attempt + 1), delay);
      this.reconnectTimers.set(service, timer);
    };
  }
}
