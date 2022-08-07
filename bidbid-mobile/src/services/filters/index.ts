import { City } from '@/models';
import { FilterAuctionStatusEnum } from '@/redux/filters/types';
import { ApiClient } from '@/services/http/client';

export class Filters {
  static async getFiltersGeneral(): Promise<any> {
    return ApiClient.get('/filters');
  }

  static async getInterests(): Promise<any> {
    return ApiClient.get('/interests');
  }

  static async resetFiltersGeneral(): Promise<any> {
    return ApiClient.post('/filters/reset');
  }

  static async setFiltersGender(genders: any[]): Promise<any> {
    return ApiClient.post('/filters/genders', { items: genders });
  }

  static async deleteFilterGender(genders: any[]): Promise<any> {
    return ApiClient.delete('/filters/genders', genders);
  }

  static async setFiltersSexualOrientations(sexualOrientations: any[]): Promise<any> {
    return ApiClient.post('/filters/sexual-orientations', { items: sexualOrientations });
  }

  static async setFilterCategories(items: any[], isFromSetting: boolean): Promise<any> {
    if (isFromSetting) {
      // search user categories
      return ApiClient.post('/filters/user-categories', { items });
    }
    return ApiClient.post('/filters/categories', { items });
  }

  static async setFilterCareerStrengths(items: any[]): Promise<any> {
    return ApiClient.post('/filters/strengths', { items });
  }

  static async setFilterLanguages(languages: any[]): Promise<any> {
    return ApiClient.post('/filters/languages', { items: languages });
  }

  static async setFilterInterests(interests: any[]): Promise<any> {
    return ApiClient.post('/filters/interests', { items: interests });
  }

  static async setFilterDistance(unit: string, max: number): Promise<any> {
    return ApiClient.post('/filters/distance', { unit: unit, max: max });
  }

  static async setFilterAgeRange(min: number, max: number): Promise<any> {
    return ApiClient.post('/filters/age-range', { min: min, max: max });
  }

  static async setFilterLocation(city: City): Promise<any> {
    if (city.isFromFilter) {
      return ApiClient.post('/filters/location', {
        lat: city.lat,
        lng: city.lng,
        name: city.name,
      });
    }
    return ApiClient.post('/filters/location', {
      id: city.id as string,
      lat: city.lat,
      lng: city.lng,
      name: city.name,
    });
  }

  static async deleteFilterLocation(): Promise<any> {
    return ApiClient.delete('/filters/location');
  }

  static async setFilterGlobal(global: boolean): Promise<any> {
    return ApiClient.post('/filters/global', { value: global });
  }

  static async setFilterAuctionStatus(auctionStatus: FilterAuctionStatusEnum): Promise<any> {
    return ApiClient.post('/filters/status', { value: auctionStatus });
  }
}
