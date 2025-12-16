import { Component, computed } from '@angular/core';
import { appResource } from '@shared/app-resource';
import { UserSubscription } from '@shared/models';
import { SubscriptionService } from 'src/app/core/services/resume/subscription.service';

@Component({
  selector: 'app-billing',
  imports: [],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css',
})
export class BillingComponent {
  protected readonly subscription = appResource<UserSubscription>({
    subscription: null,
    level: 'free',
    priceInfo: null,
  });
  protected readonly priceInfo = computed(() => this.subscription()?.priceInfo);

  constructor(private readonly subscriptionService: SubscriptionService) {
    this.subscription.setSource(this.subscriptionService.getSubscription({ withPriceInfo: true }));
  }
}
