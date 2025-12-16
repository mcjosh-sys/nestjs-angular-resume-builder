import { HttpInterceptorFn } from '@angular/common/http';
import { finalize, Observable, shareReplay } from 'rxjs';

export const dedupInterceptor: HttpInterceptorFn = (req, next) => {
  const inflightRequests = new Map<string, Observable<any>>();
  if (req.method !== 'GET') return next(req);
  const key = req.urlWithParams;

  if (inflightRequests.has(key)) {
    return inflightRequests.get(key)!;
  }

  const request$ = next(req).pipe(
    finalize(() => inflightRequests.delete(key)),
    shareReplay(1),
  );
  inflightRequests.set(key, request$);

  return request$;
};
