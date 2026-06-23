// Réalisé par Laura — Modèles partagés (rôles utilisateur)

export type UserRole = 'customer' | 'store_manager' | 'admin';

export interface UserInfo {
  role: UserRole;
}

export interface UserRecord {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}
