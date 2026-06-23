// Réalisé par Laura — Service HTTP admin (gestion utilisateurs, contrat §5.2)

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRecord, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /** GET /api/auth/users — liste tous les utilisateurs (admin uniquement). */
  getUsers(): Observable<{ users: UserRecord[] }> {
    return this.http.get<{ users: UserRecord[] }>(`${this.apiUrl}/users`);
  }

  /** PATCH /api/auth/users/:id/role — modifie le rôle d'un utilisateur. */
  updateUserRole(id: string, role: UserRole): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/users/${id}/role`, { role });
  }

  /** DELETE /api/auth/users/:id — supprime un compte utilisateur. */
  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/${id}`);
  }
}
