import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { LoadingComponent } from '@shared/components/ui/loading/loading.component';
import { ClerkService } from 'src/app/core/services/clerk/clerk.service';
import { RouterStateService } from 'src/app/core/services/router-state.service';

@Component({
  selector: 'app-login',
  imports: [LoadingComponent],
  template: `
    @if (!isMounted()) {
      <app-loading />
    }
    <div #signInContainer></div>
  `,
  host: {
    class: 'grow flex flex-col items-center justify-center',
  },
})
export class LoginComponent implements OnDestroy {
  @ViewChild('signInContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

  protected isMounted = signal(false);

  constructor(
    private readonly clerk: ClerkService,
    private readonly routerState: RouterStateService,
  ) {
    // console.log(this.routerState.afterAuthRedirectUrl());
    effect(() => {
      if (!this.clerk.isLoaded() || !this.container?.nativeElement) return;
      if (this.isMounted()) return;

      untracked(() => {
        this.clerk.mount('signIn', this.container.nativeElement, {
          forceRedirectUrl: this.routerState.afterAuthRedirectUrl(),
        });

        this.isMounted.set(true);
      });
    });
  }

  ngOnDestroy() {
    if (this.container?.nativeElement) {
      this.container.nativeElement.innerHTML = '';
    }
    this.isMounted.set(false);
  }
}
