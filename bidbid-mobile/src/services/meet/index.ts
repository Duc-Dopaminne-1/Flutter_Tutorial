import { ApiClient } from '@/services/http/client';

export class MeetAndGreet {
  static async meetArrived(auctionId: string, lng: number, lat: number, byPass: boolean): Promise<any> {
    const params = {
      lng: lng,
      lat: lat,
    };
    if (byPass) {
      params['passValidation'] = 'all';
    }
    return ApiClient.post(`/auctions/${auctionId}/arrived`, params);
  }

  static async meetConfirmation(auctionId: string): Promise<any> {
    return ApiClient.post(`/auctions/${auctionId}/confirmation`);
  }
}
