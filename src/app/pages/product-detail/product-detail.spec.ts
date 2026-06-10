import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { ProductDetail } from './product-detail';

describe('ProductDetail', () => {
  let component: ProductDetail;
  let fixture: ComponentFixture<ProductDetail>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'abc123' }) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetail);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load the product and its suggestions', () => {
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8080/api/products/abc123').flush({
      _id: 'abc123',
      name: 'Produit',
      description: 'Description',
      price: 9.99,
      category: 'Test',
      images: [],
      is_active: true,
      is_sponsored: false,
      created_by: 'user-1',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z'
    });

    httpMock.expectOne('http://localhost:8080/api/products/abc123/suggestions').flush([]);

    expect(component.state).toBe('success');
    expect(component.product?.name).toBe('Produit');
    expect(component.suggestions).toEqual([]);
  });
});
