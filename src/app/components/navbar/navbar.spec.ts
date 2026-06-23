// Réalisé par Laura — Tests unitaires Navbar (mapping rôle → menu)

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Navbar } from './navbar';
import { AuthService } from '../../services/auth';
import { UserInfo } from '../../models/user.model';

describe('Navbar — mapping rôle → menu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  function render(user: UserInfo | null): HTMLElement {
    const auth = TestBed.inject(AuthService);
    auth.currentUser.set(user);
    const fixture = TestBed.createComponent(Navbar);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('affiche les liens Connexion et Inscription pour un visiteur', () => {
    const el = render(null);
    expect(el.querySelector('[data-testid="link-login"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="link-register"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="btn-logout"]')).toBeNull();
  });

  it("affiche le lien Gestion des utilisateurs pour le rôle 'admin'", () => {
    const el = render({ role: 'admin' });
    expect(el.querySelector('[data-testid="link-admin-users"]')).not.toBeNull();
    expect(el.querySelector('[data-testid="link-login"]')).toBeNull();
  });

  it("n'affiche pas le lien admin-users pour le rôle 'customer'", () => {
    const el = render({ role: 'customer' });
    expect(el.querySelector('[data-testid="link-admin-users"]')).toBeNull();
    expect(el.querySelector('[data-testid="link-profil"]')).not.toBeNull();
  });

  it("n'affiche pas le lien admin-users pour le rôle 'store_manager'", () => {
    const el = render({ role: 'store_manager' });
    expect(el.querySelector('[data-testid="link-admin-users"]')).toBeNull();
    expect(el.querySelector('[data-testid="btn-logout"]')).not.toBeNull();
  });

  it('affiche le bouton Déconnexion pour tout rôle authentifié', () => {
    for (const role of ['customer', 'store_manager', 'admin'] as const) {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [Navbar],
        providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
      });
      const el = render({ role });
      expect(el.querySelector('[data-testid="btn-logout"]')).not.toBeNull();
    }
  });
});
