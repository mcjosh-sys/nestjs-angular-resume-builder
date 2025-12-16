import { IsString } from 'class-validator';

export class CreateStripeCheckoutSessionDto {
  @IsString()
  priceId: string;

  @IsString()
  successUrl: string;

  @IsString()
  cancelUrl: string;

  @IsString()
  tosUrl?: string;
}
