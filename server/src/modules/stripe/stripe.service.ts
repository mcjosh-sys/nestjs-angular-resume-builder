import { User } from '@/common/types/user.types';
import { Subscription } from '@/lib/generated/prisma';
import { PrismaService } from '@/prisma/prisma.service';
import { clerkClient } from '@clerk/express';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import { stripeConfig } from './config';
import { CreateStripeCheckoutSessionDto } from './dto/create-stripe-checkout-session.dto';

export type SubscriptionLevel = 'free' | 'pro' | 'pro_plus';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    @Inject(stripeConfig.KEY)
    private readonly config: ConfigType<typeof stripeConfig>,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.config.secretKey);
  }

  async createCheckoutSession(dto: CreateStripeCheckoutSessionDto, user: User) {
    if (!Object.values(this.config.priceIds).includes(dto.priceId)) {
      throw new BadRequestException('Invalid price ID');
    }
    const stripeCustomerId = (await clerkClient.users.getUser(user.id))
      .privateMetadata.stripeCustomerId as string | undefined;

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: dto.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: dto.successUrl,
      cancel_url: dto.cancelUrl,
      customer: stripeCustomerId,
      customer_email: !stripeCustomerId ? user.email : undefined,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      custom_text: {
        terms_of_service_acceptance: {
          message: `By subscribing, you agree to AI Resume Builder's ${dto.tosUrl ? '[Terms of Service](' + dto.tosUrl + ')' : 'Terms of Service'}.`,
        },
      },
      consent_collection: {
        terms_of_service: 'required',
      },
    });

    if (!session.url) {
      throw new InternalServerErrorException(
        'Failed to create Stripe checkout session',
      );
    }

    return session.url;
  }

  async handleSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
      throw new BadRequestException('UserId not found in session metadata');
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        stripeCustomerId: session.customer as string,
      },
    });
  }
  async handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    const item = subscription.items.data[0];

    if (
      subscription.status === 'active' ||
      subscription.status === 'trialing' ||
      (subscription.status === 'past_due' &&
        item.current_period_end + 1000 * 60 * 60 * 24 * 3 < Date.now())
    ) {
      await this.prisma.subscription.upsert({
        where: {
          userId: subscription.metadata.userId,
        },
        create: {
          userId: subscription.metadata.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(item.current_period_end * 1000),
          stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        update: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(item.current_period_end * 1000),
          stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    } else {
      await this.prisma.subscription.deleteMany({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
      });
    }
  }
  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    await this.prisma.subscription.deleteMany({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
    });
  }

  async getSubscription(userId: string, withPriceInfo = false) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    let priceInfo: Stripe.Price | null = null;

    if (withPriceInfo && subscription) {
      priceInfo = await this.stripe.prices.retrieve(
        subscription.stripePriceId,
        { expand: ['product'] },
      );
    }

    return {
      subscription,
      level: this.getSubscriptionLevel(subscription),
      priceInfo,
    };
  }

  private getSubscriptionLevel(
    subscription: Subscription | null,
  ): SubscriptionLevel {
    if (!subscription || subscription.stripeCurrentPeriodEnd < new Date()) {
      return 'free';
    }

    if (subscription.stripePriceId === this.config.priceIds.pro) {
      return 'pro';
    }

    if (subscription.stripePriceId === this.config.priceIds.proPlus) {
      return 'pro_plus';
    }
    return 'free';
  }

  get client(): Stripe {
    return this.stripe;
  }
}
