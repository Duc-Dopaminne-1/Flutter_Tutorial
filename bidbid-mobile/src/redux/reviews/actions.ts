import { ReviewTypes, ReviewActions } from './types';
import { ActionCallback } from '@/redux/auth';

const sendReview = (payload: {
  auctionId: string;
  score: number;
  keepContact: boolean;
  note: string;
  information: {
    partnerOnTime: boolean;
    chattingWhenLate?: boolean;
    lateTime?: string;
  };
  callback: ActionCallback;
}): ReviewActions => ({
  type: ReviewTypes.REVIEW_SEND_REVIEW,
  payload,
});

const getReviewRequired = (payload: { callback: ActionCallback }): ReviewActions => ({
  type: ReviewTypes.REVIEW_GET_REQUIRED,
  payload,
});

const saveReviewRequired = (payload: any): ReviewActions => ({
  type: ReviewTypes.REVIEW_SAVE_REQUIRED,
  payload,
});

export { sendReview, getReviewRequired, saveReviewRequired };
