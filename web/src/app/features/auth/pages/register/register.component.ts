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
  selector: 'app-register',
  imports: [LoadingComponent],
  template: `
    @if (!isMounted()) {
      <app-loading />
    }
    <div #signUpContainer></div>
  `,
  host: {
    class: 'w-full h-full flex flex-col items-center justify-center',
  },
})
export class RegisterComponent implements OnDestroy {
  @ViewChild('signUpContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

  protected isMounted = signal(false);

  constructor(
    private readonly clerk: ClerkService,
    private readonly routerState: RouterStateService,
  ) {
    effect(() => {
      if (!this.clerk.isLoaded() || !this.container?.nativeElement) return;

      untracked(() => {
        if (this.isMounted()) {
          this.container.nativeElement.innerHTML = '';
          this.isMounted.set(false);
        }

        this.clerk.mount('signUp', this.container.nativeElement, {
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
