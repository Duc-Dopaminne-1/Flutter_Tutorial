import { ApiClient } from '@/services/http/client';

export class Reviews {
  static async sendReview(
    auctionId: string,
    score: number,
    keepContact: boolean,
    note: string,
    information: {
      partnerOnTime: boolean;
      chattingWhenLate: boolean;
      lateTime: string;
    },
  ): Promise<any> {
    return ApiClient.post(`/reviews`, {
      auctionId: auctionId,
      score: score,
      keepContact: keepContact,
      note: note,
      information: information,
    });
  }

  static async getReviewRequired(): Promise<any> {
    return ApiClient.get(`/reviews/required`);
  }
}
