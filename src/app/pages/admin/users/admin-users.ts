// Réalisé par Laura — Page admin : gestion des utilisateurs

import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { UserRecord, UserRole } from '../../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  protected readonly users = signal<UserRecord[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected readonly roleOptions: UserRole[] = ['customer', 'store_manager', 'admin'];

  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.admin.getUsers().subscribe({
      next: (res) => {
        this.users.set(res.users);
        this.loading.set(false);
      },
      error: (err: { error?: { error?: string } }) => {
        this.error.set(err.error?.error ?? 'Erreur lors du chargement des utilisateurs');
        this.loading.set(false);
      },
    });
  }

  onRoleChange(userId: string, event: Event): void {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    this.clearMessages();

    this.admin.updateUserRole(userId, role).subscribe({
      next: (res) => {
        this.success.set(res.message);
        this.users.update((list) =>
          list.map((u) => (u.id === userId ? { ...u, role } : u))
        );
      },
      error: (err: { error?: { error?: string } }) => {
        this.error.set(err.error?.error ?? 'Erreur lors de la mise à jour du rôle');
        this.loadUsers();
      },
    });
  }

  onDelete(userId: string, email: string): void {
    if (!window.confirm(`Supprimer l'utilisateur « ${email} » ? Cette action est irréversible.`)) {
      return;
    }
    this.clearMessages();

    this.admin.deleteUser(userId).subscribe({
      next: (res) => {
        this.success.set(res.message);
        this.users.update((list) => list.filter((u) => u.id !== userId));
      },
      error: (err: { error?: { error?: string } }) => {
        this.error.set(err.error?.error ?? 'Erreur lors de la suppression');
      },
    });
  }

  private clearMessages(): void {
    this.error.set('');
    this.success.set('');
  }
}
