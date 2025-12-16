export interface CreateStripeCheckoutSession {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  tosUrl: string;
}

export interface UserSubscription {
  subscription: {
    userId: string;
    id: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    stripeCurrentPeriodEnd: Date;
    stripeCancelAtPeriodEnd: boolean;
  } | null;
  level: SubscriptionLevel;
  priceInfo?: any;
}

export type SubscriptionLevel = 'free' | 'pro' | 'pro_plus';
