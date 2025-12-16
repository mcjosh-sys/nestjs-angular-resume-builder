import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClerkService } from '../services/clerk/clerk.service';

export const authGuard: CanActivateFn = (route, state) => {
  const clerk = inject(ClerkService);
  const router = inject(Router);
  if (!clerk.isSignedIn()) {
    router.navigateByUrl('/sign-in');
    return false;
  }
  return true;
};
