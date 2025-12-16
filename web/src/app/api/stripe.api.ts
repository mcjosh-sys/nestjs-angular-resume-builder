import { environment } from 'src/environments/environment';
import { createApiUrlGenerator } from '../core/utils/api-helpers';

export class StripeApi {
  private static baseUrl = `${environment.apiBaseUrl}/resume/stripe`;
  private static api = createApiUrlGenerator(StripeApi.baseUrl);

  private constructor() {}

  static createCheckoutSessionUrl() {
    return StripeApi.api.generateUrl('create-checkout-session');
  }

  static getSubscriptionUrl(params?: { withPriceInfo: boolean }) {
    return StripeApi.api.generateUrl('user/subscription', params);
  }
}
