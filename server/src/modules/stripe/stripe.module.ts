import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { stripeConfig } from './config';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  controllers: [StripeController],
  imports: [ConfigModule.forFeature(stripeConfig)],
  providers: [StripeService, PrismaService],
})
export class StripeModule {}
