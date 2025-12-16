import {
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  ViewChild,
  effect,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { dark } from '@clerk/themes';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCreditCard } from '@ng-icons/lucide';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { ClerkService } from 'src/app/core/services/clerk/clerk.service';
import { PlatformService } from 'src/app/core/services/platform.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { mountComponent } from 'src/app/core/utils/dynamic-component-helpers';

@Component({
  selector: 'app-user-button',
  imports: [HlmSkeletonImports],
  template: `
    @if (!isMounted()) {
      <hlm-skeleton class="size-[35px] rounded-full" />
    }
    <div class="size-fit" #userButtonContainer></div>
  `,
  host: {
    class: 'size-fit rounded-full flex items-center justify-center',
  },
})
export class UserButtonComponent {
  @ViewChild('userButtonContainer', { static: true }) container!: ElementRef<HTMLDivElement>;

  private ngIconRef?: ComponentRef<NgIcon>;

  protected isMounted = signal(false);

  constructor(
    private readonly clerk: ClerkService,
    private readonly environmentInjector: EnvironmentInjector,
    private readonly platform: PlatformService,
    private readonly router: Router,
    private readonly themeService: ThemeService,
  ) {
    if (!this.platform.isBrowser()) return;
    effect(() => {
      if (!this.clerk.isLoaded() || !this.container?.nativeElement) return;
      const isDarkMode = this.themeService.isDarkMode();

      untracked(() => {
        this.clerk.mount('userButton', this.container?.nativeElement, {
          appearance: {
            theme: isDarkMode ? dark : undefined,
            elements: {
              avatarBox: {
                width: 35,
                height: 35,
              },
              userButtonBox: 'border-green-500 border-2 rounded-full',
            },
          },
          customMenuItems: [
            {
              label: 'Billing',
              onClick: () => {
                this.router.navigateByUrl('/billing');
              },
              mountIcon: (el) => {
                const iconRef = mountComponent({
                  el,
                  component: NgIcon,
                  environmentInjector: this.environmentInjector,
                  providers: [provideIcons({ lucideCreditCard })],
                  inputs: {
                    name: 'lucideCreditCard',
                    size: 16,
                  },
                });

                this.ngIconRef = iconRef;
              },
              unmountIcon: (el) => {
                this.ngIconRef?.destroy();
              },
            },
          ],
        });

        this.isMounted.set(true);
      });
    });
  }

  ngOnDestroy() {
    if (this.container?.nativeElement) {
      this.clerk.unmount('userButton', this.container.nativeElement);
    }
    this.ngIconRef?.destroy();
    this.isMounted.set(false);
  }
}
