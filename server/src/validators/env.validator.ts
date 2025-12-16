import Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri().required(),
  CLERK_PUBLISHABLE_KEY: Joi.string().required(),
  CLERK_SECRET_KEY: Joi.string().required(),
  GEMINI_API_KEY: Joi.string().required(),
  GEMINI_PROJECT_ID: Joi.string().required(),
  STRIPE_SECRET_KEY: Joi.string().required(),
  PRO_STRIPE_PRICE_ID: Joi.string().required(),
  PRO_PLUS_STRIPE_PRICE_ID: Joi.string().required(),
});
