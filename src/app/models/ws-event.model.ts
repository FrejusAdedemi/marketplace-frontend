// Réalisé par Laura — Typage des événements WebSocket (contrat §10.2)

export type WsOrderEvent =
  | { type: 'order.created'; order_id: string; status: 'pending' }
  | { type: 'order.confirmed'; order_id: string; status: 'confirmed' }
  | { type: 'order.cancelled'; order_id: string }
  | { type: 'order.shipped'; order_id: string }
  | { type: 'order.delivered'; order_id: string };

export type WsStockEvent = {
  type: 'stock.low';
  product_id: string;
  store_id: string;
};

export type WsEvent = WsOrderEvent | WsStockEvent;
