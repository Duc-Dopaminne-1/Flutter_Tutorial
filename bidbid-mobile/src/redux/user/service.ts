import { User } from '@/services/user';
import {
  ActionDeleteAccountPayload,
  ActionSaveLastLocationPayload,
  ActionSendInvitePayload,
  ActionUpdateUserPayload,
  UpdateHideAgePayload,
  UserActionCreateCityPayload,
  UserActionGetInterestsPayload,
  UserActionUpdateCityPayload,
} from '@/redux/user/index';
import { PHOTO_CREATE_PAYLOAD } from '@/models/photo';
import { GENDER_TYPE } from '@/models/gender';

export interface CREATE_PHOTO_PARAMS {
  data: PHOTO_CREATE_PAYLOAD;
  userId: string;
}

export interface PHOTO_DELETE_PARAMS {
  photoId: number;
  userId: string;
}

export interface UPDATE_GENDER_PARAMS {
  genderId: GENDER_TYPE;
  userId: string;
}

export const getUserProfile = async () => {
  try {
    const response = await User.getProfile();
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getUser = async () => {
  try {
    const response = await User.getUser();
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const createPhoto = async (params: CREATE_PHOTO_PARAMS): Promise<any> => {
  try {
    const response = await User.createPhoto(params);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updatePhoto = async (userId: string, photoId: number, data: any): Promise<any> => {
  try {
    const response = await User.updatePhoto(userId, photoId, data);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateProfilePicture = async (data): Promise<any> => {
  try {
    const response = await User.updateProfilePicture(data);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const changePhotoToAvatar = async (userId: string, photoId: number): Promise<any> => {
  try {
    const response = await User.changePhotoToAvatar(userId, photoId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const deletePhoto = async (params: PHOTO_DELETE_PARAMS): Promise<any> => {
  try {
    const response = await User.deletePhoto(params);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateGender = async (params: UPDATE_GENDER_PARAMS): Promise<any> => {
  try {
    const response = await User.updateGender(params);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};
export const updateHideAge = async (params: UpdateHideAgePayload): Promise<any> => {
  try {
    const response = await User.updateHideAge(params);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getSexualOrientation = async (): Promise<any> => {
  try {
    const response = await User.getSexualOrientations();
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateSexualOrientation = async (userId: string, sexualOrientations: number[]): Promise<any> => {
  try {
    const response = await User.updateSexualOrientations(userId, sexualOrientations);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getCompany = async (keyWork: string, currentPage: number, perPage: number): Promise<any> => {
  try {
    const response = await User.getCompany(keyWork, currentPage, perPage);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateCompany = async (userId: string, companyId: number): Promise<any> => {
  try {
    const response = await User.updateCompany(userId, companyId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const createCompany = async (userId: string, name: string): Promise<any> => {
  try {
    const response = await User.createCompany(userId, name);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getJobs = async (keyWork: string, currentPage: number, perPage: number): Promise<any> => {
  try {
    const response = await User.getJob(keyWork, currentPage, perPage);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateJob = async (userId: string, jobId: number): Promise<any> => {
  try {
    const response = await User.updateJob(userId, jobId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const createJob = async (userId: string, name: string): Promise<any> => {
  try {
    const response = await User.createJob(userId, name);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getSchools = async (keyWork: string, currentPage: number, perPage: number): Promise<any> => {
  try {
    const response = await User.getSchool(keyWork, currentPage, perPage);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateSchool = async (userId: string, schoolId: number): Promise<any> => {
  try {
    const response = await User.updateSchool(userId, schoolId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const createSchool = async (userId: string, name: string): Promise<any> => {
  try {
    const response = await User.createSchool(userId, name);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getLanguages = async (): Promise<any> => {
  try {
    const response = await User.getLanguages();
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateLanguages = async (userId: string, languagesIds: number[]): Promise<any> => {
  try {
    const response = await User.updateLanguages(userId, languagesIds);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateUser = async (param: ActionUpdateUserPayload) => {
  try {
    const response = await User.updateUser(param);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getInterests = async (param: UserActionGetInterestsPayload) => {
  try {
    const response = await User.getInterests(param);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getCareerStrengths = async () => {
  try {
    const response = await User.getCareerStrengths();
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateAboutMe = async (userId: string, description: string): Promise<any> => {
  try {
    const response = await User.updateAboutMe(userId, description);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateJobTitle = async (userId: string, jobTitle: string): Promise<any> => {
  try {
    const response = await User.updateJobTitle(userId, jobTitle);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateInstagramUsername = async (userId: string, instagramUsername: string): Promise<any> => {
  try {
    const response = await User.updateInstagramUsername(userId, instagramUsername);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateUsername = async (userId: string, firstName: string, lastName: string): Promise<any> => {
  try {
    const response = await User.updateUsername(userId, firstName, lastName);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const createCity = async (param: UserActionCreateCityPayload, userId: string): Promise<any> => {
  try {
    const response = await User.createCity(param, userId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateCity = async (param: UserActionUpdateCityPayload, locationId: number): Promise<any> => {
  try {
    const response = await User.updateCity(param, locationId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const getGenders = async (order?: string): Promise<any> => {
  try {
    const response = await User.getGenders(order);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};
export const getHideAge = async (): Promise<any> => {
  try {
    const response = await User.getHideAge();
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const deleteAccount = async (params: ActionDeleteAccountPayload): Promise<any> => {
  try {
    const response = await User.deleteAccount(params);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const pauseAccount = async (userId: string): Promise<any> => {
  try {
    const response = await User.pauseAccount(userId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const unPauseAccount = async (userId: string): Promise<any> => {
  try {
    const response = await User.unPauseAccount(userId);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const updateShowMe = async (userId: string, genders: any[]): Promise<any> => {
  try {
    const response = await User.updateShowMe(userId, genders);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const verifyUserPhoto = async (userId: string, data: any): Promise<any> => {
  try {
    const response = await User.verifyUserPhoto(userId, data);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const sendInvite = async (param: ActionSendInvitePayload) => {
  try {
    const response = await User.sendInvite(param);
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const getListInvited = async () => {
  try {
    const response = await User.getListInvited();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const checkLivingAuctions = async () => {
  try {
    const response = await User.checkLivingAunctions();
    return {
      result: response,
    };
  } catch (error) {
    return { error };
  }
};

export const updateAppLanguage = async (userId: string, appLanguage: string): Promise<any> => {
  try {
    const response = await User.updateAppLanguage({ userId, appLanguage });
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};

export const saveLastLocation = async (param: ActionSaveLastLocationPayload): Promise<any> => {
  try {
    const response = await User.saveLastLocation(param);
    return { result: response, error: null };
  } catch (error) {
    return { result: null, error: error };
  }
};
