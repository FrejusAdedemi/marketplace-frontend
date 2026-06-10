import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { ProductForm } from './product-form';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ProductForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should deny access when the user is not logged in', () => {
    fixture.detectChanges();

    expect(component.accessDenied).toBe(true);
    expect(component.checkingAccess).toBe(false);
  });

  it('should allow access for a store_manager and display the create form', () => {
    localStorage.setItem('access_token', 'fake-token');

    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8080/api/auth/me').flush({ role: 'store_manager' });

    expect(component.accessDenied).toBe(false);
    expect(component.isEditMode).toBe(false);
  });
});
