import { BaseModel, MeetPlace, Charity, Category, User } from './index';

export const AuctionStatus = {
  BIDDING: 'bidding',
  READY_TO_PAY: 'ready_to_pay',
  READY_TO_MEET: 'ready_to_meet',
  COMPLETING: 'completing',
  WAITING_PAYMENT: 'waiting_payment',
  FAILED: 'failed',
  COMPLETED: 'completed',
  NO_WINNER: 'no_winner',
  FAILED_PAYMENT: 'failed_payment',
  CANCEL: 'cancel',
  PROCESSING: 'processing',
};

export const AUCTION_TYPE = {
  RAFFLE: 'raffle',
  BID: 'bid',
};

export const CREATE_AUCTION_TIME = {
  AUCTION: 'auction',
  MEETING: 'meeting',
};

export const CancelAuction = {
  CHANGED_MY_MIND: 'CHANGED_MY_MIND',
  OTHER: 'OTHER',
};

export interface DURATION {
  id: number;
  name: string;
  type: string;
  seconds: number;
  order: number;
}

export type TIME_MEET = DURATION;

export interface MEETING_DURATION {
  name: string;
  value: number;
}

export interface Auction extends BaseModel {
  endAt?: string;
  startingPrice?: number;
  endNowPrice?: number;
  type?: string;
  lastBid?: any;
  roomId?: string;
  orders?: any;
  reservePrice?: null;
  dynamicLink?: string;
  donationName?: string;
  amount?: any;
  donationPercent?: number;
  winningPrice?: null;
  soldTickets?: number;
  charityId?: number;
  meetDate?: Date;
  meetPlaceId?: string;
  donationAmount?: number;
  systemFeeAmount?: number;
  isBiddee?: boolean;
  receipt?: any;
  creatorId?: string;
  creator?: any;
  entryPrice?: number;
  endNowBid?: any;
  offering?: string;
  winningBid?: any;
  winningBidId?: string;
  bids?: any;
  meetPlace?: MeetPlace;
  charity?: Charity;
  categories?: Category[];
  meetingDuration?: MEETING_DURATION;
  status?: string;
  id?: number;
  cancel?: any;

  biddeeArrived?: any;
  bidderArrived?: any;

  confirmedAt?: any;
  reviews?: any[];

  winner?: User;
}
