import { Inject, Injectable, REQUEST_CONTEXT, signal } from '@angular/core';
import { RequestContext } from '@shared/models/request-context.model';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root',
})
export class RequestContextService {
  private readonly _context = signal<RequestContext | null>(null);

  readonly context = this._context.asReadonly();

  constructor(
    private readonly platform: PlatformService,
    @Inject(REQUEST_CONTEXT) private readonly ctx: RequestContext | null,
  ) {
    if (this.ctx) {
      this._context.set(this.ctx);
    }
  }

  get authUser() {
    return this._context()?.state?.authUser ?? null;
  }

  get theme() {
    return this._context()?.state?.theme ?? null;
  }
}
