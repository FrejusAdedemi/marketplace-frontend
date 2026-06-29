import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateOrderItem {
  product_id: string;
  store_id: string;
  quantity: number;
  unit_price: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = '/api/orders';

  constructor(private http: HttpClient) {}

  createOrder(items: CreateOrderItem[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, { items });
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getOrder(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}