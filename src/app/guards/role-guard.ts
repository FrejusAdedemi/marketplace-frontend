// Réalisé par Laura — Guard de rôle (protection routes admin)

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserRole } from '../models/user.model';

/**
 * Guard fonctionnel retournant un `CanActivateFn` filtrant par rôle(s) autorisé(s).
 * Usage : canActivate: [authGuard, roleGuard(['admin'])]
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const role = auth.getRole();

  if (role !== null && allowedRoles.includes(role)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
