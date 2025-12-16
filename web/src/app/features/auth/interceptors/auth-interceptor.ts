import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, from, shareReplay, switchMap, throwError } from 'rxjs';
import { ClerkService } from 'src/app/core/services/clerk/clerk.service';

let refreshInProgress$ = null as null | ReturnType<typeof from>;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const clerk = inject(ClerkService);
  const token = clerk.token();
  const router = inject(Router);

  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        if (!refreshInProgress$) {
          refreshInProgress$ = from(clerk.refreshToken()).pipe(
            shareReplay(1),
            finalize(() => {
              refreshInProgress$ = null;
            }),
          );
        }

        return refreshInProgress$.pipe(
          switchMap((newToken: string | null) => {
            if (!newToken) {
              router.navigateByUrl('/sign-in');
              return throwError(() => new Error('Token refresh failed'));
            }

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshErr) => {
            if (refreshErr instanceof HttpErrorResponse && refreshErr.status === 401)
              router.navigateByUrl('/sign-in');
            return throwError(() => refreshErr);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
