import { Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { ButtonVariants, HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlm } from '@spartan-ng/helm/utils';
import { ClassValue } from 'clsx';

@Component({
  selector: 'app-loading-button',
  imports: [HlmButton, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideLoaderCircle })],
  template: `
    <button
      hlmBtn
      [variant]="variant()"
      [size]="size()"
      [type]="type()"
      (click)="onClick.emit($event)"
      [disabled]="loading() || disabled()"
      [class]="computedClass()"
    >
      @if (loading()) {
        <ng-icon hlm name="lucideLoaderCircle" size="sm" class="animate-spin"></ng-icon>
      }
      <ng-content />
    </button>
  `,
  host: {
    class: 'h-fit w-fit',
  },
})
export class LoadingButtonComponent {
  readonly loading = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly variant = input<ButtonVariants['variant']>('default');
  readonly size = input<ButtonVariants['size']>('default');
  readonly className = input<ClassValue>('', { alias: 'class' });
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly onClick = output<PointerEvent>();

  protected readonly computedClass = computed(() =>
    hlm('flex items-center gap-2', this.className()),
  );
}
