import { Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'app-loading',
  imports: [NgIcon, HlmIcon],
  providers: [provideIcons({ lucideLoaderCircle })],
  template: ` <ng-icon hlm name="lucideLoaderCircle" size="xl" class="animate-spin" />`,
  host: {
    '[class]': 'computedClass()',
  },
})
export class LoadingComponent {
  protected readonly _userClass = input<ClassValue>(
    'h-full w-full flex items-center justify-center bg-background',
  );

  protected readonly computedClass = computed(() =>
    hlm('h-full w-full flex items-center justify-center bg-background', this._userClass()),
  );
}
