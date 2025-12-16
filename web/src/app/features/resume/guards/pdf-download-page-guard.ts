import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PlatformService } from 'src/app/core/services/platform.service';

export const pdfDownloadPageGuard: CanActivateFn = (route, state) => {
  const platform = inject(PlatformService);

  return !platform.isBrowser();
};
