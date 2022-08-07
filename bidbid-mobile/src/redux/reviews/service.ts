import { Reviews } from '@/services/reviews';

export const getReviewRequired = async () => {
  try {
    const response = await Reviews.getReviewRequired();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const sendReview = async (
  auctionId: string,
  score: number,
  keepContact: boolean,
  note: string,
  information: {
    partnerOnTime: boolean;
    chattingWhenLate: boolean;
    lateTime: string;
  },
) => {
  try {
    const response = await Reviews.sendReview(auctionId, score, keepContact, note, information);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};
