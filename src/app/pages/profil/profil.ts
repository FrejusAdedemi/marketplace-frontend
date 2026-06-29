import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.html',
  styleUrl: './profil.scss'
})
export class Profil implements OnInit {
  user: any = null;

  form = {
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  };

  error = '';
  success = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const localProfile = this.authService.getLocalProfile();

    this.form.first_name = localProfile.first_name || '';
    this.form.last_name = localProfile.last_name || '';
    this.form.phone = localProfile.phone || '';
    this.form.address = localProfile.address || '';

    this.authService.getMe().subscribe({
      next: (data: any) => {
        this.user = data?.user ?? data;
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  onUpdate(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.authService.updateMe(this.form)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.success = 'Profil mis à jour !';
        },
        error: () => {
          this.error = 'Erreur lors de la mise à jour';
        }
      });
  }

  onLogout(): void {
    this.authService.logout();
  }
}