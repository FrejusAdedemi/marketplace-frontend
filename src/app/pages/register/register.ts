import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  email = '';
  password = '';
  error = '';
  success = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    this.authService.register(this.email, this.password)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.success = 'Compte créé ! Redirection...';
          setTimeout(() => this.router.navigate(['/login']), 800);
        },
        error: (err) => {
          this.error = err.error?.error || 'Erreur lors de l’inscription';
        }
      });
  }
}