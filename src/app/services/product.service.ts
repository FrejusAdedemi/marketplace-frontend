import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  attributes?: any;
  images?: string[];
  is_active?: boolean;
  is_sponsored?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = '/api/products';

  private readonly headers = new HttpHeaders({
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  });

  constructor(private http: HttpClient) {}

  getProducts(filters: any = {}): Observable<any> {
    let params = new HttpParams().set('_t', Date.now().toString());

    if (filters.page) params = params.set('page', String(filters.page));
    if (filters.limit) params = params.set('limit', String(filters.limit));
    if (filters.sort) params = params.set('sort', String(filters.sort));

    if (filters.search && String(filters.search).trim()) {
      params = params.set('search', String(filters.search).trim());
    }

    if (filters.category && String(filters.category).trim()) {
      params = params.set('category', String(filters.category).trim());
    }

    return this.http.get<any>(this.apiUrl, {
      params,
      headers: this.headers
    });
  }

  getProduct(id: string): Observable<any> {
    const params = new HttpParams().set('_t', Date.now().toString());

    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      params,
      headers: this.headers
    });
  }

  getSuggestions(id: string): Observable<any> {
    const params = new HttpParams().set('_t', Date.now().toString());

    return this.http.get<any>(`${this.apiUrl}/${id}/suggestions`, {
      params,
      headers: this.headers
    });
  }

  createProduct(product: Partial<Product>): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}