import { ApiClient } from '@/services/http/client';
import {
  ActionUpdateUserPayload,
  UpdateHideAgePayload,
  UserActionCreateCityPayload,
  UserActionUpdateCityPayload,
  USER,
  ActionDeleteAccountPayload,
  ActionSendInvitePayload,
  UserActionGetInterestsPayload,
  UpdateAppLanguagePayload,
  ActionSaveLastLocationPayload,
} from '@/redux/user';
import { CREATE_PHOTO_PARAMS, PHOTO_DELETE_PARAMS, UPDATE_GENDER_PARAMS } from '@/redux/user/service';

export class User {
  static async getInterests(param: UserActionGetInterestsPayload): Promise<any> {
    const { isFromRegister } = param;
    if (isFromRegister) {
      return ApiClient.get('/interests', {}, false, false);
    }
    return ApiClient.get('/interests');
  }

  static async getCareerStrengths(): Promise<any> {
    return ApiClient.get('/strengths');
  }

  static async getProfile(): Promise<USER> {
    return ApiClient.get('/users/me/profile');
  }

  static async getUser(): Promise<USER> {
    return ApiClient.get('/users/me?v=2.6.0');
  }

  static async createPhoto(params: CREATE_PHOTO_PARAMS): Promise<any> {
    const URL = '/users/' + params.userId + '/photos';
    return ApiClient.post(URL, params.data.data);
  }

  static async updatePhoto(userId: string, photoId: number, data: { data: any }): Promise<any> {
    const URL = '/users/' + userId + '/photos/' + photoId;
    return ApiClient.put(URL, data.data);
  }

  static async changePhotoToAvatar(userId: string, photoId: number): Promise<any> {
    const URL = '/users/' + userId + '/photos/' + photoId + '/avatar';
    return ApiClient.post(URL);
  }

  static async deletePhoto(params: PHOTO_DELETE_PARAMS): Promise<any> {
    const URL = '/users/' + params.userId + '/photos/' + params.photoId;
    return ApiClient.delete(URL);
  }

  static async updateGender(params: UPDATE_GENDER_PARAMS): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { genderId: params.genderId });
  }

  static async updateHideAge(params: UpdateHideAgePayload): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { hideAge: params.hideAge });
  }

  static async saveLastLocation(param: ActionSaveLastLocationPayload): Promise<any> {
    const { lat, lng } = param;
    return ApiClient.post('/users/last-login', { lng, lat });
  }

  static async updateAppLanguage(params: UpdateAppLanguagePayload): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { appLanguage: params.appLanguage });
  }

  static async getSexualOrientations(): Promise<any> {
    const URL = '/sexual-orientations/';
    return ApiClient.get(URL);
  }

  static async getGenders(order?: string): Promise<any> {
    const url = `/genders?sort=${order || 'order'}`;
    return ApiClient.get(url, {}, false, true);
  }

  static async getHideAge(): Promise<any> {
    return ApiClient.get('/users/me');
  }

  static async updateSexualOrientations(_userId: string, sexualOrientations: number[]): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { sexualOrientationIds: sexualOrientations });
  }

  // Company
  static async getCompany(keyWork: string, currentPage = 1, perPage = 10): Promise<any> {
    let URL = '';
    if (keyWork && keyWork.length > 0) {
      URL = `/companies/?page=${currentPage}&perPage=${perPage}&q=${keyWork}`;
    } else {
      URL = `/companies/?page=${currentPage}&perPage=${perPage}`;
    }
    return ApiClient.get(URL);
  }

  static async updateCompany(_userId: string, companyId: number): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { companyId });
  }

  static async createCompany(userId: string, name: string): Promise<any> {
    const URL = `/users/${userId}/company`;
    return ApiClient.post(URL, { name: name });
  }

  // Jobs
  static async getJob(keyWork: string, currentPage = 1, perPage = 10): Promise<any> {
    let URL = '';
    if (keyWork && keyWork.length > 0) {
      URL = `/jobs/?page=${currentPage}&perPage=${perPage}&q=${keyWork}`;
    } else {
      URL = `/jobs/?page=${currentPage}&perPage=${perPage}`;
    }
    return ApiClient.get(URL);
  }

  static async updateJob(_userId: string, jobId: number): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { jobId });
  }

  static async createJob(userId: string, name: string): Promise<any> {
    const URL = '/users/' + userId + '/job';
    return ApiClient.post(URL, { name: name });
  }

  // Schools
  static async getSchool(keyWork: string, currentPage = 1, perPage = 10): Promise<any> {
    let URL = '';
    if (keyWork && keyWork.length > 0) {
      URL = `/schools/?page=${currentPage}&perPage=${perPage}&q=${keyWork}`;
    } else {
      URL = `/schools/?page=${currentPage}&perPage=${perPage}`;
    }
    return ApiClient.get(URL);
  }

  static async updateSchool(_userId: string, schoolId: number): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { schoolId: schoolId });
  }

  static async createSchool(userId: string, name: string): Promise<any> {
    const URL = '/users/' + userId + '/school';
    return ApiClient.post(URL, { name: name });
  }

  static async getLanguages(): Promise<any> {
    const URL = '/languages';
    return ApiClient.get(URL, {}, false, false);
  }

  static async updateLanguages(_userId: string, languagesIds: number[]): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { languageIds: languagesIds });
  }

  static async updateUser(param: ActionUpdateUserPayload): Promise<USER> {
    const url = `/users/me`;
    let data: any = {};

    if (param?.strengthIds?.length > 0) {
      data.strengthIds = param.strengthIds;
    }

    if (param?.interestIds?.length > 0) {
      data.interestIds = param.interestIds;
    }

    if (param?.categoryIds?.length >= 0) {
      data.categoryIds = param.categoryIds;
    }

    return ApiClient.put(url, data);
  }

  static async updateAboutMe(_userId: string, description: string): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { description: description });
  }

  static async updateJobTitle(_userId: string, jobTitle: string): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { jobTitle: jobTitle });
  }

  static async updateInstagramUsername(_userId: string, instagramUsername: string): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { instagramUsername });
  }

  static async updateUsername(_userId: string, firstName: string, lastName: string): Promise<any> {
    const URL = '/users/me';
    return ApiClient.put(URL, { firstName, lastName });
  }

  static async createCity(param: UserActionCreateCityPayload, userId: string): Promise<any> {
    const url = `/users/${userId}/city`;
    return ApiClient.put(url, param);
  }

  static async updateCity(param: UserActionUpdateCityPayload, locationId: number): Promise<any> {
    const url = `/locations/${locationId}`;
    return ApiClient.put(url, param);
  }

  static async deleteAccount(params: ActionDeleteAccountPayload): Promise<any> {
    const { userId, reason, note } = params;
    const URL = `/users/${userId}`;
    const data = {
      reason: reason,
      note: note,
    };
    return ApiClient.delete(URL, data);
  }

  static async pauseAccount(userId: string): Promise<any> {
    const URL = `/users/${userId}/pause`;
    return ApiClient.post(URL, { type: 'self' });
  }

  static async unPauseAccount(userId: string): Promise<any> {
    const URL = `/users/${userId}/unpause`;
    return ApiClient.post(URL);
  }

  static async updateShowMe(userId: string, genders: any[]): Promise<any> {
    const URL = `/users/${userId}/show-me`;
    return ApiClient.put(URL, { items: genders });
  }

  static async verifyUserPhoto(userId: string, data: any): Promise<any> {
    const URL = '/users/' + userId + '/photos';
    return ApiClient.post(URL, data);
  }

  static async updateProfilePicture(data: any): Promise<any> {
    const URL = '/users/photos/thumbnail';
    return ApiClient.post(URL, data, {}, {}, true, false);
  }

  static async sendInvite(param: ActionSendInvitePayload): Promise<any> {
    return ApiClient.post('/users/invitations/send-invite', param);
  }

  static async getListInvited(): Promise<any> {
    return ApiClient.get('/users/invitations/over-invited');
  }

  static async checkLivingAunctions(): Promise<any> {
    return ApiClient.get('/users/check-living-auctions');
  }
}
