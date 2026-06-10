import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Catalog } from './catalog';

describe('Catalog', () => {
  let component: Catalog;
  let fixture: ComponentFixture<Catalog>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalog],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Catalog);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load the first page of products on init', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'http://localhost:8080/api/products' &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '12'
    );
    req.flush({ products: [], total: 0, page: 1, limit: 12 });

    expect(component.state).toBe('success');
    expect(component.totalPages).toBe(1);
  });

  it('should reset to page 1 and reload when filters are applied', () => {
    fixture.detectChanges();
    httpMock.expectOne(() => true).flush({ products: [], total: 0, page: 1, limit: 12 });

    component.page = 3;
    component.category = 'High-Tech';
    component.applyFilters();

    const req = httpMock.expectOne(
      (request) => request.params.get('category') === 'High-Tech' && request.params.get('page') === '1'
    );
    req.flush({ products: [], total: 0, page: 1, limit: 12 });

    expect(component.page).toBe(1);
  });
});
