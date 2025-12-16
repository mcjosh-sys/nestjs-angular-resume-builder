import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideLoaderCircle } from '@ng-icons/lucide';
import { BrnDialogImports, BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { toast } from 'ngx-sonner';
import { finalize } from 'rxjs';
import { EventBusService } from 'src/app/core/services/refresh/event-bus.service';
import { SubscriptionService } from 'src/app/core/services/resume/subscription.service';
import { environment } from 'src/environments/environment';

export interface PremiumModalEvents {
  state: BrnDialogState;
}

@Component({
  selector: 'app-premium-modal',
  imports: [HlmDialogImports, BrnDialogImports, HlmIcon, NgIcon, HlmButton],
  providers: [provideIcons({ lucideCheck, lucideLoaderCircle })],
  templateUrl: './premium-modal.component.html',
})
export class PremiumModalComponent {
  protected readonly state = signal<BrnDialogState>('closed');
  protected readonly pending = signal({
    pro: false,
    proPlus: false,
  });
  protected readonly loading = computed(() => this.pending().pro || this.pending().proPlus);

  constructor(
    private readonly eventBus: EventBusService<PremiumModalEvents>,
    private readonly subscriptionService: SubscriptionService,
  ) {
    this.eventBus
      .on('state')
      .pipe(takeUntilDestroyed())
      .subscribe((state) => {
        this.state.set(state);
      });
  }

  get premiumFeatures() {
    return ['AI tools', 'Up to 3 resumes'];
  }

  get premiumPlusFeatures() {
    return ['AI tools', 'Unlimited resumes', 'Design customizations'];
  }

  get priceIds() {
    return environment.stripe.priceIds;
  }

  handleStateChanged(state: BrnDialogState) {
    if (state === 'closed') {
      this.state.set('closed');
    }
  }
  setPending(priceId: string, value: boolean) {
    if (priceId === this.priceIds.pro) {
      this.pending.update((p) => ({ ...p, pro: value }));
    } else if (priceId === this.priceIds.proPlus) {
      this.pending.update((p) => ({ ...p, proPlus: value }));
    }
  }

  handlePremiumClick(priceId: string) {
    this.setPending(priceId, true);
    this.subscriptionService
      .createCheckoutSession(priceId)
      .pipe(finalize(() => this.setPending(priceId, false)))
      .subscribe({
        next: (url) => {
          console.log('Redirecting to checkout URL:', url);
          window.location.href = url;
        },
        error: (error) => {
          console.error(error);
          toast.error('Failed to create checkout session. Please try again.');
        },
      });
  }
}
