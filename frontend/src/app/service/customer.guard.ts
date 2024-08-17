import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isTokenExpired()) {
    authService.clearToken();
    router.navigate(['/login']);
    return false;
  }

  const role = authService.getUserRole();
  if (role !== 'ROLE_CUSTOMER') {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};