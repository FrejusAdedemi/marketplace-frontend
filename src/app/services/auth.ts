import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserInfo, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  /** Utilisateur courant dérivé du token JWT stocké en localStorage. */
  readonly currentUser = signal<UserInfo | null>(this.loadUserFromToken());

  constructor(private http: HttpClient, private router: Router) {}

  register(email: string, password: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, { email, password });
  }

  login(email: string, password: string): Observable<unknown> {
    return this.http
      .post<{ access_token: string; refresh_token: string }>(
        `${this.apiUrl}/login`,
        { email, password }
      )
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
          this.currentUser.set(this.loadUserFromToken());
        })
      );
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {
        refresh_token: localStorage.getItem('refresh_token'),
      })
      .subscribe();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getMe(): Observable<unknown> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  updateMe(data: Record<string, string>): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/me`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRole(): UserRole | null {
    return this.currentUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private loadUserFromToken(): UserInfo | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    const role = payload?.['role'] as UserRole | undefined;
    if (!role) return null;
    return { role };
  }

  private decodeToken(token: string): Record<string, unknown> | null {
    try {
      const raw = token.split('.')[1];
      const padded = raw.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(padded)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
