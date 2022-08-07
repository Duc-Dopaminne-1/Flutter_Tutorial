// @ts-ignore
import stripe from 'tipsi-stripe';

export interface StripeParam {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  addressZip: string;
  name?: string;
  currency?: string;
  addressLine1?: string;
  addressLine2?: string;
  addressCity?: string;
  addressState?: string;
  addressCountry?: string;
}

export const createTokenWithCard = (params: StripeParam) => stripe.createTokenWithCard(params);
