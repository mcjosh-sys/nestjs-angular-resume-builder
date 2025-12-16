import { registerAs } from '@nestjs/config';

export const stripeConfig = registerAs('stripeConfig', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  priceIds: {
    pro: process.env.PRO_STRIPE_PRICE_ID!,
    proPlus: process.env.PRO_PLUS_STRIPE_PRICE_ID!,
  },
}));
