import { SubscriptionLevel } from '@/modules/stripe/stripe.service';

export function canCreateResumes(
  subscriptionLevel: SubscriptionLevel,
  currentResumesCount: number,
): boolean {
  const limits: Record<SubscriptionLevel, number> = {
    free: 3,
    pro: 10,
    pro_plus: Infinity,
  };

  return currentResumesCount < limits[subscriptionLevel];
}

export function canUseAIFeatures(
  subscriptionLevel: SubscriptionLevel,
): boolean {
  return subscriptionLevel !== 'free';
}

export function canUseCustomizationFeatures(
  subscriptionLevel: SubscriptionLevel,
): boolean {
  return subscriptionLevel === 'pro_plus';
}
