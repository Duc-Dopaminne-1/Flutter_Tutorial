import { ApiClient } from '@/services/http/client';
import {
  ActionDiscoveryDetailPayload,
  ActionDiscoveryPayload,
  ActionLikeDiscoveryPayload,
  ActionUnLikeDiscoveryPayload,
  ActionRevertLikeDiscoveryPayload,
} from '@/redux/discovery';

export class Discovery {
  static async getDiscovery(params: ActionDiscoveryPayload): Promise<any> {
    const { perPage, latitude, longitude, filterGlobal, instaUsername, findProfiles } = params;

    let url = `/users/discovery?perPage=${perPage}`;

    findProfiles.map(item => {
      url = url + `&targets=${item.type}`;
    });

    if (!filterGlobal) {
      url = url + `&lat=${latitude}&lng=${longitude}`;
    }

    if (instaUsername) {
      url = url + `&instaUsername=${instaUsername}`;
    }

    return ApiClient.get(url);
  }

  static async getDiscoveryDetail(params: ActionDiscoveryDetailPayload): Promise<any> {
    const url = `/users/discovery/${params.userId}`;
    return ApiClient.get(url);
  }

  static async setLikeDiscovery(params: ActionLikeDiscoveryPayload): Promise<any> {
    const url = `/users/${params.userId}/like`;
    return ApiClient.post(url);
  }

  static async setRevertLikeDiscovery(params: ActionRevertLikeDiscoveryPayload): Promise<any> {
    const url = `/users/${params.userId}/revert`;
    return ApiClient.post(url);
  }

  static async setUnLikeDiscovery(params: ActionUnLikeDiscoveryPayload): Promise<any> {
    const url = `/users/${params.userId}/dislike`;
    return ApiClient.post(url);
  }

  static async getTotalDonate(params: ActionDiscoveryDetailPayload): Promise<any> {
    const url = `/donations/total?userId=${params.userId}`;
    return ApiClient.get(url);
  }

  static async searchIGUsername(keyword: string): Promise<any> {
    return ApiClient.get('/users/instagram/suggestions', { q: keyword, perPage: 5, page: 1 });
  }
}
