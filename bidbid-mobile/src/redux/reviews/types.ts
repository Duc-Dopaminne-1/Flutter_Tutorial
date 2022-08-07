import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';

// Action Types
export enum ReviewTypes {
  REVIEW_SEND_REVIEW = 'REVIEW_SEND_REVIEW',
  REVIEW_GET_REQUIRED = 'REVIEW_GET_REQUIRED',

  REVIEW_SAVE_REQUIRED = 'REVIEW_SAVE_REQUIRED',
}

export interface ReviewSendReviewAction extends Action {
  type: ReviewTypes.REVIEW_SEND_REVIEW;
  payload: {
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
  };
}

export interface ReviewGetRequiredAction extends Action {
  type: ReviewTypes.REVIEW_GET_REQUIRED;
  payload: {
    // auctionId: string;
    callback: ActionCallback;
  };
}

export interface ReviewSaveRequiredAction extends Action {
  type: ReviewTypes.REVIEW_SAVE_REQUIRED;
  payload: any;
}

export type ReviewActions = ReviewSendReviewAction | ReviewGetRequiredAction | ReviewSaveRequiredAction;
