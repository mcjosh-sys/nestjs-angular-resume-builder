import { inject, provideAppInitializer } from '@angular/core';
import { ClerkService } from '../services/clerk/clerk.service';

function initClerk(clerk: ClerkService) {
  return () => clerk.load();
}

export const provideClerk = () => provideAppInitializer(() => initClerk(inject(ClerkService))());
