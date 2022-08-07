import { BaseModel } from './base-model';

export interface NotificationSetting extends BaseModel {
  type: string;
  value: boolean;
}

export const DeepLinkNotification = {
  LIKE: 'like',
  AUCTION_END: 'auction_ended',
  PAYOUT: 'payout',
  MEETING_ENDED: 'meeting_ended',
  AUCTION_CREATED: 'auction_created',
  LOST_HIGHEST_BID: 'lost_highest_bid',
  WON_AUCTION: 'won_auction',
  PAYMENT_FAILED: 'payment_failed',
  SYSTEM: 'system',
  NEWS: 'news',
  UPDATES: 'updates',
  NEW_MESSAGE: 'new_message',
  AUCTION_CANCELED: 'auction_cancelled',
  PAYOUT_SENT: 'payout-sent',
  REMIND_ON_TIME: 'remind_before_meeting_1h',
  REMIND_SCAN_QR: 'remind_scan_qr',
  MEETING_BIDDEE_ABSENT: 'meeting_biddee_absent',
  MEETING_BIDDER_ABSENT: 'meeting_bidder_absent',
  PAYMENT_FAILED_REMIND_30: 'payment_failed_remind_30m',
  PAYMENT_FAILED_REMIND_5: 'payment_failed_remind_5m',
  PAYPAL_PAYMENT_FAILED: 'paypal_payment_failed',
  PAYMENT_FAILED_END_BID_NOW: 'payment_failed_end_bid_now',
  PAYMENT_ISSUE: 'payment_issue',
  REVIEW_LOW: 'bad_review',
  REMIND_JOIN_ZOOM: 'remind_join_zoom',
  REMIND_MEETING_1ST: 'remind_meeting_time_left_5m',
  REMIND_MEETING_2ND: 'remind_meeting_time_left_1m',
  REMIND_MEETING_3RD: 'remind_meeting_time_left_10s',
  VERIFY_REJECTED: 'verify_rejected',
  VERIFY_APPROVED: 'verify_approved',
  AUCTION_END_NO_WINNER: 'auction_ended_no_winner',
  RAFFLE_ENDED_FOR_CREATOR: 'raffle_ended_for_creator',
  RAFFLE_ENDED_FOR_WINNER: 'raffle_ended_for_winner',
  RAFFLE_ENDED_FOR_PARTICIPANT: 'raffle_ended_for_participant',
  RAFFLE_CREATED: 'raffle_created',
};

export const TypeRemindNotification = [
  DeepLinkNotification.REMIND_MEETING_1ST,
  DeepLinkNotification.REMIND_MEETING_2ND,
  DeepLinkNotification.REMIND_MEETING_3RD,
  DeepLinkNotification.MEETING_ENDED,
];
