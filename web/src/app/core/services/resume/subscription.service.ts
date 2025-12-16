import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse, CreateStripeCheckoutSession, UserSubscription } from '@shared/models';
import { map, throwError } from 'rxjs';
import { StripeApi } from 'src/app/api/stripe.api';
import { withCache } from '../../interceptors/http-cache';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly http = inject(HttpClient);

  createCheckoutSession(priceId: string) {
    const baseUrl = window?.location?.origin;
    if (!baseUrl) return throwError(() => new Error('Base URL not found'));
    const payload: CreateStripeCheckoutSession = {
      priceId,
      successUrl: `${baseUrl}/billing/success`,
      cancelUrl: `${baseUrl}/billing`,
      tosUrl: `${baseUrl}/terms-of-service`,
    };
    return this.http
      .post<ApiResponse<{ url: string }>>(StripeApi.createCheckoutSessionUrl(), payload)
      .pipe(map((res) => res.data.url));
  }

  getSubscription(opts?: { withPriceInfo: boolean }) {
    return this.http
      .get<
        ApiResponse<UserSubscription>
      >(StripeApi.getSubscriptionUrl(opts), { context: withCache() })
      .pipe(map((res) => res.data));
  }

  // getSubscriptionLevel() {
  //   return this.getSubscription().pipe(
  //     switchMap((subscription) => {
  //       const level = this.getSubscriptionLevelHelper(subscription);
  //       if (level === undefined) {
  //         return throwError(() => new Error('Invalid subscription'));
  //       }
  //       return of(level);
  //     }),
  //   );
  // }

  // private getSubscriptionLevelHelper(
  //   subscription: UserSubscription | null,
  // ): SubscriptionLevel | undefined {
  //   if (!subscription || subscription?.stripeCurrentPeriodEnd < new Date()) {
  //     return 'free';
  //   }

  //   if (subscription.stripePriceId === environment.proStripePriceId) {
  //     return 'pro';
  //   }

  //   if (subscription.stripePriceId === environment.proPlusStripePriceId) {
  //     return 'pro_plus';
  //   }
  //   return undefined;
  // }
}
