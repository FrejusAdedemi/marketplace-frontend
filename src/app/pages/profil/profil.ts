import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.html',
  styleUrl: './profil.scss'
})
export class Profil implements OnInit {
  user: any = null;
  form = { first_name: '', last_name: '', phone: '', address: '' };
  error = '';
  success = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (data) => {
        this.user = data;
        this.form.first_name = data.first_name || '';
        this.form.last_name  = data.last_name  || '';
        this.form.phone      = data.phone      || '';
        this.form.address    = data.address    || '';
      },
      error: () => this.router.navigate(['/login'])
    });
  }

  onUpdate() {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.authService.updateMe(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Profil mis à jour !';
      },
      error: () => {
        this.loading = false;
        this.error = 'Erreur lors de la mise à jour';
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }
}