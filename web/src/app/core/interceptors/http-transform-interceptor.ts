import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { HTTP_TRANSFORM_TOKEN } from '../tokens/http-transform.token';
import { applyHttpTransformers } from './http-transform/http-transform-helpers';

export const httpTransformInterceptor: HttpInterceptorFn = (req, next) => {
  const transforms = req.context.get(HTTP_TRANSFORM_TOKEN);

  if (!transforms) {
    return next(req);
  }

  const body = req.body ? applyHttpTransformers(req.body, transforms, 'request') : req.body;

  const clonedReq = req.clone({ body });

  return next(clonedReq).pipe(
    map((event) => {
      if (event instanceof HttpResponse) {
        const resBody = applyHttpTransformers(event.body, transforms, 'response');

        return event.clone({ body: resBody });
      }

      return event;
    }),
  );
};
