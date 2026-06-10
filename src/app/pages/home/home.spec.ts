import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and load sponsored products and best sellers', () => {
    fixture.detectChanges();

    const requests = httpMock.match(
      (req) => req.url === 'http://localhost:8080/api/products' && req.params.get('sort') === 'created_at_desc'
    );
    expect(requests.length).toBe(2);
    requests.forEach((req) => req.flush({ products: [], total: 0, page: 1, limit: 8 }));

    expect(component).toBeTruthy();
    expect(component.sponsoredState).toBe('success');
    expect(component.bestSellersState).toBe('success');
  });
});
