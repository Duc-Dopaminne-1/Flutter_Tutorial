/* eslint-disable @typescript-eslint/ban-types */
import { ReviewActions, ReviewTypes } from './types';

export interface ReviewInit {
  data: ReviewData;
}
export interface ReviewData {
  data: {
    auctionId: string;
    keepContact: boolean;
    reviewerId: string;
    user: any;
    userId: string;
    score?: number;
  };
}
const initialState: ReviewData = {
  data: {
    auctionId: '',
    keepContact: false,
    reviewerId: '',
    user: {},
    userId: '',
    score: 0,
  },
};

const reducer = (state: ReviewData = initialState, action: ReviewActions): ReviewData => {
  switch (action.type) {
    case ReviewTypes.REVIEW_SAVE_REQUIRED:
      const newData = action.payload;
      return {
        ...state,
        data: newData,
      };
    case ReviewTypes.REVIEW_GET_REQUIRED:
    case ReviewTypes.REVIEW_SEND_REVIEW:

    default:
      return state;
  }
};

export default reducer;
