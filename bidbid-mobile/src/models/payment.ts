import { BaseModel } from './index';

export interface PaymentProcess {
  data: {
    approveUrl: string;
    auctionId: string;
    id: number;
    status: string;
  };
  message: string;
  status: string;
}

export const PAYMENT_STATUS = {
  PROCESS_PAYMENT: 'PROCESS_PAYMENT',
  AUCTION_PROCESSING_TRY_LATER: 'AUCTION_PROCESSING_TRY_LATER',
  INVALID_BID: 'INVALID_BID',
  USER_IN_AUCTION_BLACKLIST: 'USER_IN_AUCTION_BLACKLIST',
};

export interface Payment extends BaseModel {
  id: number;
  type: string;
  token: string;
  globalId: string;
  userId: string;
  cardType: string;
  expirationMonth: string;
  expirationYear: string;
  expirationDate: string;
  last4: string;
  uniqueNumberIdentifier: string;
  sourceDescription: null;
  username: null;
  venmoUserId: null;
  email: null;
  payerId: null;
}
