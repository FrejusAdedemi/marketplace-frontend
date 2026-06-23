// Réalisé par Laura — Navbar globale (menu adapté au rôle)

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  constructor(protected readonly auth: AuthService) {}

  onLogout(): void {
    this.auth.logout();
  }
}
