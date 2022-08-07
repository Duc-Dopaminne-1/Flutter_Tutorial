import { ApiClient } from '@/services/http/client';
import {
  CreateAuctionProp,
  ActionSearchCityPayload,
  ActionSearchNearPlacePayload,
  RequestAdditionalCharityPayload,
  ActionUpdateStatusAuctionPayload,
} from '@/redux/auction';
import Config from 'react-native-config';
import {
  getAuctionDetailActionPayload,
  GetAuctionsWonActionPayload,
  getTokenZoomActionPayload,
  SaveCancelMeetActionPayload,
  setStatusRoomActionPayload,
} from '@/redux/myBids/types';
import { ActionCharitiesPayload } from '@/redux/auction/actions';

const PER_PAGE_DEFAULT = 10;

export class Auction {
  static async getDurations(): Promise<any> {
    return ApiClient.get('/durations');
  }

  static async getSettingDefault(): Promise<any> {
    return ApiClient.get('/settings', {}, false, false);
  }

  static async getCategories(): Promise<any> {
    return ApiClient.get('/categories');
  }

  static async getDonatePercents(): Promise<any> {
    return ApiClient.get('/donation-percents');
  }

  static async getCountryCode(): Promise<any> {
    return ApiClient.customUrlGet('https://geolocation-db.com/json/');
  }

  static async getCharities(param: ActionCharitiesPayload): Promise<any> {
    const { perPage, keyword, page } = param;
    return ApiClient.get('/charities', { q: keyword, perPage, page });
  }

  static async requestAdditionalCharity(param: RequestAdditionalCharityPayload): Promise<any> {
    const { charityName, headquartersAddress } = param;
    return ApiClient.post('/charity-requests', { name: charityName, address: headquartersAddress });
  }

  static async setCancelMeet(param: SaveCancelMeetActionPayload): Promise<any> {
    return ApiClient.post(`/auctions/${param.auctionId}/cancel`, {
      reason: param.reason,
      note: param.note,
    });
  }

  static async getAuctionDetail(param: getAuctionDetailActionPayload): Promise<any> {
    return ApiClient.get(`/auctions/${param.auctionId}`);
  }

  static async getZoomToken(param: getTokenZoomActionPayload): Promise<any> {
    return ApiClient.get(`/auctions/${param.auctionId}/meeting-room`);
  }

  static async setStatusRoom(param: setStatusRoomActionPayload): Promise<any> {
    return ApiClient.put(`/meeting-room/${param.auctionId}/status`, {
      action: 'leave',
    });
  }

  static async getAuction(): Promise<any> {
    return ApiClient.get('/auctions/creator');
  }

  static async searchCity(param: ActionSearchCityPayload): Promise<any> {
    const { lat, long } = param;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat}, ${long}&sensor=false&key=${Config.GOOGLE_MAP_API_KEY}`;
    return ApiClient.customUrlGet(url);
  }

  static async searchNearPlace(param: ActionSearchNearPlacePayload): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${param.lat}, ${param.long}&rankby=distance&pagetoken=${param.pageToken}&keyword=${param.type}&type=${param.type}&key=${Config.GOOGLE_MAP_API_KEY}`;
    return ApiClient.customUrlGet(url);
  }

  static async createAuction(param: CreateAuctionProp): Promise<any> {
    return ApiClient.post('/auctions', param);
  }

  static async getAuctionsBidding(): Promise<any> {
    return ApiClient.get('/auctions/bidding');
  }

  static async getAuctionsWon(param: GetAuctionsWonActionPayload): Promise<any> {
    return ApiClient.get(`/auctions/won/?page=${param.currentPage}&perPage=${param.perPage}`);
  }

  static async getAuctionsLiked(): Promise<any> {
    return ApiClient.get('/auctions/liked');
  }

  static async getMyAuctionHistory(perPage: number, offset: string): Promise<any> {
    let url = `/auctions/history?status=completed&status=cancel&status=failed_payment`;
    if (perPage && perPage > 0) {
      url = url + '&perPage=' + perPage;
    } else {
      url = url + '&perPage=' + PER_PAGE_DEFAULT;
    }

    if (offset && offset.length > 0) {
      url = url + '&offset=' + offset;
    }
    return ApiClient.get(url);
  }

  static async getMyAuctionActive(): Promise<any> {
    return ApiClient.get(`/auctions/history?status=bidding&status=ready_to_meet&status=waiting_payment`);
  }

  static async getAuctionLasted(): Promise<any> {
    return ApiClient.get(`/auctions/history?perPage=1&order=createdAt`);
  }

  static async updateStatusAuction(param: ActionUpdateStatusAuctionPayload): Promise<any> {
    return ApiClient.post(`/auctions/${param.id}/notify?type=updated`);
  }
}
