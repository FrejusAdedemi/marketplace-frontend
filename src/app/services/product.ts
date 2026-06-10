import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ProductFilters, ProductListResult } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Le front ne parle qu'à l'API Gateway, jamais directement à un microservice.
  // Pas d'environment.ts dans le projet : on suit le pattern déjà utilisé par AuthService (URL en dur).
  private readonly apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters = {}): Observable<ProductListResult> {
    let params = new HttpParams();

    if (filters.page) params = params.set('page', filters.page);
    if (filters.limit) params = params.set('limit', filters.limit);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http
      .get<unknown>(this.apiUrl, { params })
      .pipe(map((response) => this.toListResult(response, filters)));
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<{ product?: Product } | Product>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => (response as { product?: Product }).product ?? (response as Product)));
  }

  getSuggestions(id: string): Observable<Product[]> {
    return this.http
      .get<unknown>(`${this.apiUrl}/${id}/suggestions`)
      .pipe(map((response) => this.toProductArray(response)));
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * TODO mock : il n'existe pas d'endpoint "best sellers" dans le contrat d'API produits.
   * En attendant un futur endpoint dédié côté product-service, on approxime les
   * meilleures ventes par les produits les plus récents (sort=created_at_desc).
   */
  getBestSellers(limit = 8): Observable<Product[]> {
    return this.getProducts({ limit, sort: 'created_at_desc' }).pipe(
      map((result) => result.products)
    );
  }

  /**
   * TODO mock : la liste /api/products n'expose pas de filtre "sponsorisé".
   * On récupère un lot de produits récents et on filtre côté front sur `is_sponsored`.
   */
  getSponsoredProducts(limit = 8): Observable<Product[]> {
    return this.getProducts({ limit: 50, sort: 'created_at_desc' }).pipe(
      map((result) => result.products.filter((product) => product.is_sponsored).slice(0, limit))
    );
  }

  private toProductArray(response: unknown): Product[] {
    if (Array.isArray(response)) return response as Product[];
    const products = (response as { products?: Product[] } | null)?.products;
    return products ?? [];
  }

  private toListResult(response: unknown, filters: ProductFilters): ProductListResult {
    const products = this.toProductArray(response);
    const body = response as { total?: number; page?: number; limit?: number } | null;
    const limit = body?.limit ?? filters.limit ?? products.length;
    const total = body?.total ?? products.length;
    const page = body?.page ?? filters.page ?? 1;

    return {
      products,
      total,
      page,
      limit,
      totalPages: limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1
    };
  }
}
