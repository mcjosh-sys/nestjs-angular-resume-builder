import { Injectable, makeStateKey, Signal, signal } from '@angular/core';
import { SignInProps, SignUpProps, UserButtonProps } from '@clerk/clerk-js/dist/types/ui/types';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlatformService } from '../platform.service';
import { RequestContextService } from '../request-context.service';

export type Clerk = InstanceType<typeof import('@clerk/clerk-js').Clerk>;
export type UserResource = Clerk['user'];

export const CLERK_SSR_USER_KEY = makeStateKey<UserResource>('clerk-user');

@Injectable({
  providedIn: 'root',
})
export class ClerkService {
  private publickKey = environment.clerkPublishableKey;
  private clerk?: Clerk;
  private isBrowser!: Signal<boolean>;

  private readonly sub = new Subscription();

  private readonly _isLoaded = signal(false);
  private readonly _user = signal<Clerk['user'] | null>(null);
  private readonly _isSignedIn = signal(false);
  private readonly _token = signal<string | null>(null);

  readonly isLoaded = this._isLoaded.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isSignedIn = this._isSignedIn.asReadonly();
  readonly token = this._token.asReadonly();

  constructor(
    private readonly platform: PlatformService,
    private readonly reqContext: RequestContextService,
  ) {
    this.isBrowser = this.platform.isBrowser;
    if (this.platform.isServer()) {
      const authUser = this.reqContext.context()?.state?.authUser;

      if (authUser) {
        this._isSignedIn.set(authUser.isAuthenticated);
        if (authUser.token) {
          this._token.set(authUser.token);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async load() {
    if (!this.isBrowser() || !this.publickKey) {
      return Promise.resolve();
    }
    return import('@clerk/clerk-js').then(async (m) => {
      this.clerk = new m.Clerk(this.publickKey);
      await this.clerk.load({
        signInUrl: environment.clerkSignInUrl,
        signUpUrl: environment.clerkSignUpUrl,
      });

      this._isLoaded.set(true);
      this._user.set(this.clerk.user ?? null);
      await this.refreshToken();

      this.sub.add(
        this.clerk.addListener(({ user }) => {
          this._user.set(user ?? null);
          this._isSignedIn.set(!!user);
        }),
      );
    });
  }

  async refreshToken() {
    let token: string | null | undefined = null;
    if (this.isLoaded()) {
      token = await this.clerk!.session?.getToken({ template: 'jwt-csr' });
    } else {
      token = this.reqContext.context()?.state?.authUser?.token;
    }
    if (token !== undefined) this._token.set(token);
    return token;
  }

  mount<T extends 'signIn' | 'signUp' | 'userButton'>(
    ...args: T extends 'signIn'
      ? [type: T, element: HTMLDivElement, options?: SignInProps]
      : T extends 'signUp'
        ? [type: T, element: HTMLDivElement, options?: SignUpProps]
        : [type: T, element: HTMLDivElement, options?: UserButtonProps]
  ) {
    const [type, element, options] = args;
    if (this._isLoaded()) {
      switch (type) {
        case 'signIn':
          this.clerk!.mountSignIn(element, options);
          break;
        case 'signUp':
          this.clerk!.mountSignUp(element, options);
          break;
        case 'userButton':
          this.clerk!.mountUserButton(element, options);
          break;
      }
    }
  }

  unmount(type: 'signIn' | 'signUp' | 'userButton', element: HTMLDivElement) {
    if (this._isLoaded()) {
      switch (type) {
        case 'signIn':
          this.clerk!.unmountSignIn(element);
          break;
        case 'signUp':
          this.clerk!.unmountSignUp(element);
          break;
        case 'userButton':
          this.clerk!.unmountUserButton(element);
          break;
      }
    }
  }
}
