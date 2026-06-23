// Réalisé par Laura — Tests unitaires WebSocketService (parsing/typage événements)

import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { WsEvent, WsOrderEvent, WsStockEvent } from '../models/ws-event.model';

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketService);
  });

  afterEach(() => {
    service.disconnect();
  });

  it('doit être créé', () => {
    expect(service).toBeTruthy();
  });

  it('expose events$ en tant qu'Observable', () => {
    expect(service.events$).toBeDefined();
  });

  it('propage les événements injectés via events$', () => {
    const received: WsEvent[] = [];
    service.events$.subscribe((e) => received.push(e));

    const evt: WsEvent = { type: 'order.created', order_id: 'abc', status: 'pending' };
    // Injection directe dans le Subject interne pour tester le flux sans WebSocket réel
    (service as unknown as { eventsSubject: { next: (e: WsEvent) => void } }).eventsSubject.next(evt);

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(evt);
  });

  describe('Parsing — événements order.*', () => {
    it('narrow order.created correctement', () => {
      const raw = '{"type":"order.created","order_id":"o1","status":"pending"}';
      const evt = JSON.parse(raw) as WsEvent;
      expect(evt.type).toBe('order.created');
      if (evt.type === 'order.created') {
        const typed: WsOrderEvent & { type: 'order.created' } = evt;
        expect(typed.order_id).toBe('o1');
        expect(typed.status).toBe('pending');
      }
    });

    it('narrow order.confirmed correctement', () => {
      const raw = '{"type":"order.confirmed","order_id":"o2","status":"confirmed"}';
      const evt = JSON.parse(raw) as WsEvent;
      expect(evt.type).toBe('order.confirmed');
      if (evt.type === 'order.confirmed') {
        expect(evt.order_id).toBe('o2');
        expect(evt.status).toBe('confirmed');
      }
    });

    it('narrow order.cancelled correctement', () => {
      const raw = '{"type":"order.cancelled","order_id":"o3"}';
      const evt = JSON.parse(raw) as WsEvent;
      expect(evt.type).toBe('order.cancelled');
      if (evt.type === 'order.cancelled') {
        expect(evt.order_id).toBe('o3');
      }
    });

    it('narrow order.shipped correctement', () => {
      const raw = '{"type":"order.shipped","order_id":"o4"}';
      const evt = JSON.parse(raw) as WsEvent;
      if (evt.type === 'order.shipped') {
        expect(evt.order_id).toBe('o4');
      } else {
        throw new Error('Type inattendu');
      }
    });

    it('narrow order.delivered correctement', () => {
      const raw = '{"type":"order.delivered","order_id":"o5"}';
      const evt = JSON.parse(raw) as WsEvent;
      if (evt.type === 'order.delivered') {
        expect(evt.order_id).toBe('o5');
      } else {
        throw new Error('Type inattendu');
      }
    });
  });

  describe('Parsing — événement stock.low', () => {
    it('narrow stock.low correctement', () => {
      const raw = '{"type":"stock.low","product_id":"p1","store_id":"s1"}';
      const evt = JSON.parse(raw) as WsEvent;
      expect(evt.type).toBe('stock.low');
      if (evt.type === 'stock.low') {
        const typed: WsStockEvent = evt;
        expect(typed.product_id).toBe('p1');
        expect(typed.store_id).toBe('s1');
      }
    });
  });
});
