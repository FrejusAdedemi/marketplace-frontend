import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the gateway with the given filters and normalize a paginated response', () => {
    const mockProducts: Product[] = [
      {
        _id: '1',
        name: 'Produit test',
        description: 'Description',
        price: 19.99,
        category: 'High-Tech',
        images: [],
        is_active: true,
        is_sponsored: false,
        created_by: 'user-1',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z'
      }
    ];

    service.getProducts({ page: 1, limit: 12, sort: 'price_asc' }).subscribe((result) => {
      expect(result.products).toEqual(mockProducts);
      expect(result.total).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'http://localhost:8080/api/products' &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '12' &&
        request.params.get('sort') === 'price_asc'
    );
    expect(req.request.method).toBe('GET');
    req.flush({ products: mockProducts, total: 1, page: 1, limit: 12 });
  });

  it('should send create/update/delete requests to the gateway products endpoint', () => {
    service.deleteProduct('abc').subscribe();
    const req = httpMock.expectOne('http://localhost:8080/api/products/abc');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
