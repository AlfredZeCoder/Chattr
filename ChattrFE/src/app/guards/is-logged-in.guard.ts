import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { filter, firstValueFrom } from 'rxjs';

export const isLoggedInGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Waits for a non-null value (true or false) before continuing
  const isLoggedIn = await firstValueFrom(
    authService.isLoggedIn$.pipe(filter((value) => value !== null))
  );

  if (isLoggedIn) {
    router.navigate(['/chat']);
    return false; // Blocks access to the login page
  } else {
    return true; // Allows access to the login page
  }
};
