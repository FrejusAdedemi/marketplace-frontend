// Réalisé par Laura — Tests unitaires role-guard

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { roleGuard } from './role-guard';
import { AuthService } from '../services/auth';
import { UserRole } from '../models/user.model';

describe('roleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  function run(allowed: UserRole[], currentRole: UserRole | null): boolean | unknown {
    const auth = TestBed.inject(AuthService);
    auth.currentUser.set(currentRole ? { role: currentRole } : null);
    return TestBed.runInInjectionContext(() =>
      roleGuard(allowed)({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  it('autorise le rôle admin quand admin est dans la liste', () => {
    expect(run(['admin'], 'admin')).toBe(true);
  });

  it('autorise store_manager quand store_manager est dans la liste', () => {
    expect(run(['admin', 'store_manager'], 'store_manager')).toBe(true);
  });

  it('refuse un rôle non présent dans la liste', () => {
    expect(run(['admin'], 'customer')).toBe(false);
  });

  it('refuse quand aucun utilisateur connecté', () => {
    expect(run(['admin'], null)).toBe(false);
  });

  it('redirige vers /login quand accès refusé', () => {
    const router = TestBed.inject(Router);
    const spy = vi.spyOn(router, 'navigate');
    run(['admin'], 'customer');
    expect(spy).toHaveBeenCalledWith(['/login']);
  });

  it('redirige vers /login quand non connecté', () => {
    const router = TestBed.inject(Router);
    const spy = vi.spyOn(router, 'navigate');
    run(['admin'], null);
    expect(spy).toHaveBeenCalledWith(['/login']);
  });
});
