import { Component, computed, input, output, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircle, lucideLoaderCircle, lucideSquare, lucideSquircle } from '@ng-icons/lucide';
import { UserSubscription } from '@shared/models';
import { Prettify } from '@shared/models/utility.model';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { finalize } from 'rxjs';
import { SubscriptionService } from 'src/app/core/services/resume/subscription.service';
import { premiumModal } from 'src/app/core/utils/modal-helpers';
import { canUseCustomizationFeatures } from 'src/app/core/utils/resume/permissions';

type ValueOf<T> = Prettify<T[keyof T]>;

export const BorderStyles = {
  SQUARE: 'square',
  CIRCLE: 'circle',
  SQUIRCLE: 'squircle',
} as const;

export const borderValues = {
  circle: '9999px',
  square: '0px',
  squircle: '10%',
};

export type BorderStyle = keyof typeof borderValues;

const borderStyles = Object.keys(borderValues) as BorderStyle[];

@Component({
  selector: 'app-border-style-button',
  imports: [NgIcon, HlmIcon, HlmButton],
  providers: [provideIcons({ lucideSquircle, lucideCircle, lucideSquare, lucideLoaderCircle })],
  template: `
    <button
      hlmBtn
      [disabled]="loading()"
      variant="outline"
      size="icon"
      title="Change border style"
      [class.invisible]="loading()"
      (click)="handleClick()"
    >
      <ng-icon hlm [name]="loading() ? 'lucideLoaderCircle' : icon()" size="sm"></ng-icon>
    </button>
  `,
})
export class BorderStyleButtonComponent {
  readonly borderStyle = input<string | undefined>();
  readonly onChange = output<string>();

  protected readonly icon = computed(() => {
    return this.borderStyle() === 'square'
      ? 'lucideSquare'
      : this.borderStyle() === 'circle'
        ? 'lucideCircle'
        : 'lucideSquircle';
  });
  protected readonly loading = signal(false);
  protected readonly subscription = signal<UserSubscription>({ level: 'free', subscription: null });

  private readonly premiumModal = premiumModal();

  constructor(private readonly subscriptionService: SubscriptionService) {
    this.loading.set(true);
    this.subscriptionService
      .getSubscription()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(this.subscription.set);
  }

  handleClick() {
    if (!canUseCustomizationFeatures(this.subscription().level)) {
      return this.premiumModal.open();
    }
    const currentIndex = this.borderStyle() ? borderStyles.indexOf(this.borderStyle() as any) : 0;
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    this.onChange.emit(borderStyles[nextIndex]);
  }
}
