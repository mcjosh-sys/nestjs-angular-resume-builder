import { Public } from '@/common/decorators/public.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Query,
  type RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import type { Request } from 'express';
import Stripe from 'stripe';
import { stripeConfig } from './config';
import { CreateStripeCheckoutSessionDto } from './dto/create-stripe-checkout-session.dto';
import { StripeService } from './stripe.service';

@Controller('resume/stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    @Inject(stripeConfig.KEY)
    private readonly config: ConfigType<typeof stripeConfig>,
  ) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() dto: CreateStripeCheckoutSessionDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    if (!user || !user.email) {
      return new UnauthorizedException('Unauthorized');
    }
    const url = await this.stripeService.createCheckoutSession(dto, user);

    return { url };
  }

  @Public()
  @Post('webhook')
  async webhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;
    const body = req.body;
    try {
      if (!body || !signature) {
        throw new BadRequestException('Invalid request');
      }
      event = this.stripeService.client.webhooks.constructEvent(
        body,
        signature,
        this.config.webhookSecret,
      );
      // console.log(`Received event: ${event.type} \n`, event.data.object);
      switch (event.type) {
        case 'checkout.session.completed':
          await this.stripeService.handleSessionCompleted(event.data.object);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.stripeService.handleSubscriptionCreatedOrUpdated(
            event.data.object.id,
          );
          break;
        case 'customer.subscription.deleted':
          await this.stripeService.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }
      return { received: true };
    } catch (error) {
      console.error(
        '⚠️  Webhook signature verification failed.',
        error.message,
      );
      throw error;
    }
  }

  @Get('user/subscription')
  getSubscription(
    @Req() req: Request,
    @Query('withPriceInfo') withPriceInfo?: boolean,
  ) {
    const user = req.user;
    if (!user) {
      return new UnauthorizedException('Unauthorized');
    }
    return this.stripeService.getSubscription(user.id, withPriceInfo);
  }
}
