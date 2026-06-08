import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  attributes: any;
  images: string[];
  is_active: boolean;
  is_sponsored: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3002/products';

  constructor(private http: HttpClient) {}

  getProducts(filters: any = {}): Observable<any> {
    let params = new HttpParams();

    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getSuggestions(id: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${id}/suggestions`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/test`, product);
  }
}