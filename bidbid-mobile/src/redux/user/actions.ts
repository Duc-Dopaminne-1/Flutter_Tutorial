import { PHOTO_CREATE_PAYLOAD, PHOTO_DELETE_PAYLOAD } from '@/models/photo';
import {
  USER,
  UserActionLoadUserData,
  UserActionType,
  UserActionSaveUser,
  UserActionGetInterests,
  UserActionUpdateUser,
  ActionUpdateUserPayload,
  UserActionDeletePhoto,
  UserActionUpdatePhoto,
  UserActionChangePhotoToAvatar,
  UserActionCreatePhoto,
  UserActionUpdateGender,
  UserActionUpdateHideAge,
  UserActionGetSexualOrientations,
  UserActionUpdateSexualOrientations,
  UserActionGetSchools,
  UserActionUpdateSchool,
  UserActionGetLanguages,
  UserActionUpdateLanguages,
  UserActionUpdateAboutMe,
  UserActionUpdateJobTitle,
  UserActionUpdateInstagramUsername,
  UserActionCreateCity,
  UserActionCreateCityPayload,
  UserActionUpdateCity,
  UserActionUpdateCityPayload,
  UserActionGetGenders,
  UserAction,
  ActionDeleteAccountPayload,
  UserActionVerifyPhoto,
  UserActionCreateSchool,
  ActionSendInvite,
  ActionSendInvitePayload,
  ActionGetInvited,
  UserActionGetJobs,
  UserActionCreateJob,
  UserActionUpdateJob,
  UserActionGetCompany,
  UserActionUpdateCompany,
  UserActionCreateCompany,
  UserActionCheckLivingAuctions,
  UserActionGetCareerStrengths,
  UserActionGetInterestsPayload,
  UserActionGetHideAge,
  UserActionUpdateAppLanguage,
  ActionSaveLastLocation,
  ActionSaveLastLocationPayload,
  UpdateAppLanguagePayload,
  UserActionUpdateProfilePicture,
  UserActionUpdateUsername,
  UserActionUpdateUserNamePayload,
  UserActionGetProfile,
} from '@/redux/user/index';
import { LANGUAGE_MODEL } from '@/models/language';
import { ActionCallback } from '@/redux/auth';

export const updateUser = (payload: ActionUpdateUserPayload): UserActionUpdateUser => {
  return {
    type: UserActionType.UPDATE_USER,
    payload,
  };
};

export const getInterest = (payload: UserActionGetInterestsPayload): UserActionGetInterests => {
  return {
    type: UserActionType.GET_INTERESTS,
    payload,
  };
};

// Add career strengths
export const getCareerStrengths = (payload: ActionCallback): UserActionGetCareerStrengths => {
  return {
    type: UserActionType.GET_CAREER_STRENGTHS,
    payload,
  };
};

export const getUserProfile = (payload: ActionCallback): UserActionGetProfile => {
  return {
    type: UserActionType.GET_USER_PROFILE,
    payload,
  };
};

export const getUser = (payload: ActionCallback): UserActionLoadUserData => {
  return {
    type: UserActionType.LOAD_USER_DATA,
    payload,
  };
};

export const saveUser = (payload: USER): UserActionSaveUser => {
  return {
    type: UserActionType.SAVE_USER,
    payload,
  };
};

//Photo
export const createPhoto = (payload: PHOTO_CREATE_PAYLOAD): UserActionCreatePhoto => {
  return {
    type: UserActionType.CREATE_PHOTO,
    payload,
  };
};

export const updatePhoto = (photoId: number, data: any): UserActionUpdatePhoto => {
  return {
    type: UserActionType.UPDATE_PHOTO,
    payload: {
      photoId: photoId,
      data: data,
    },
  };
};

export const updateProfilePicture = (data: any, callback?: ActionCallback): UserActionUpdateProfilePicture => {
  return {
    type: UserActionType.UPDATE_PROFILE_PICTURE,
    payload: {
      data: data,
      callback,
    },
  };
};

export const changePhotoToAvatar = (payload: { photoId: number }): UserActionChangePhotoToAvatar => {
  return {
    type: UserActionType.CHANGE_PHOTO_TO_AVATAR,
    payload,
  };
};

export const deletePhoto = (payload: PHOTO_DELETE_PAYLOAD): UserActionDeletePhoto => {
  return {
    type: UserActionType.DELETE_PHOTO,
    payload,
  };
};

// Gender
export const updateGender = (genderId: number): UserActionUpdateGender => {
  return {
    type: UserActionType.UPDATE_GENDER,
    payload: genderId,
  };
};

// HideAge
export const updateHideAge = (hideAge: boolean): UserActionUpdateHideAge => {
  return {
    type: UserActionType.UPDATE_HIDE_AGE,
    payload: { hideAge },
  };
};

// Get Sexual-Orientations
export const getSexualOrientation = (payload: ActionCallback): UserActionGetSexualOrientations => {
  return {
    type: UserActionType.GET_SEXUAL_ORIENTATION,
    payload,
  };
};

// Update Sexual-Orientations
export const updateSexualOrientation = (payload: {
  sexualOrientations: number[];
  callback?: ActionCallback;
}): UserActionUpdateSexualOrientations => {
  return {
    type: UserActionType.UPDATE_SEXUAL_ORIENTATION,
    payload,
  };
};

// Get Company
export const getCompany = (payload: {
  keyWork: string;
  currentPage: number;
  perPage: number;
  callback: ActionCallback;
}): UserActionGetCompany => {
  return {
    type: UserActionType.GET_COMPANY,
    payload,
  };
};

// Update Company
export const updateCompany = (payload: { companyId: number }): UserActionUpdateCompany => {
  return {
    type: UserActionType.UPDATE_COMPANY,
    payload,
  };
};

// Create Company
export const createCompany = (payload: { name: string }): UserActionCreateCompany => {
  return {
    type: UserActionType.CREATE_COMPANY,
    payload,
  };
};

// Get Jobs
export const getJobs = (payload: {
  keyWork: string;
  currentPage: number;
  perPage: number;
  callback: ActionCallback;
}): UserActionGetJobs => {
  return {
    type: UserActionType.GET_JOBS,
    payload,
  };
};

// Update Job
export const updateJob = (payload: { jobId: number }): UserActionUpdateJob => {
  return {
    type: UserActionType.UPDATE_JOB,
    payload,
  };
};

// Create Job
export const createJob = (payload: { name: string }): UserActionCreateJob => {
  return {
    type: UserActionType.CREATE_JOB,
    payload,
  };
};

// Get Schools
export const getSchools = (payload: {
  keyWork: string;
  currentPage: number;
  perPage: number;
  callback: ActionCallback;
}): UserActionGetSchools => {
  return {
    type: UserActionType.GET_SCHOOLS,
    payload,
  };
};

// Update School
export const updateSchool = (payload: { schoolId: number }): UserActionUpdateSchool => {
  return {
    type: UserActionType.UPDATE_SCHOOL,
    payload,
  };
};

// Create School
export const createSchool = (payload: { name: string }): UserActionCreateSchool => {
  return {
    type: UserActionType.CREATE_SCHOOL,
    payload,
  };
};

// Get Language
export const getLanguages = (payload: ActionCallback): UserActionGetLanguages => {
  return {
    type: UserActionType.GET_LANGUAGES,
    payload,
  };
};

// Update School
export const updateLanguages = (payload: { languages: LANGUAGE_MODEL[]; callback?: ActionCallback }): UserActionUpdateLanguages => {
  return {
    type: UserActionType.UPDATE_LANGUAGES,
    payload,
  };
};

// Update About Me
export const updateAboutMe = (payload: string): UserActionUpdateAboutMe => {
  return {
    type: UserActionType.UPDATE_ABOUT_ME,
    payload,
  };
};

// Update Job Title
export const updateJobTitle = (payload: string): UserActionUpdateJobTitle => {
  return {
    type: UserActionType.UPDATE_JOB_TITLE,
    payload,
  };
};

// Update Instagram Username
export const updateInstagramUsername = (payload: string): UserActionUpdateInstagramUsername => {
  return {
    type: UserActionType.UPDATE_INSTAGRAM_USERNAME,
    payload,
  };
};

// Update Name
export const updateUserName = (payload: UserActionUpdateUserNamePayload): UserActionUpdateUsername => {
  return {
    type: UserActionType.UPDATE_USERNAME,
    payload,
  };
};

export const createCity = (payload: UserActionCreateCityPayload): UserActionCreateCity => {
  return {
    type: UserActionType.CREATE_CITY,
    payload,
  };
};

export const updateCity = (payload: UserActionUpdateCityPayload): UserActionUpdateCity => {
  return {
    type: UserActionType.UPDATE_CITY,
    payload,
  };
};

// Get Genders
export const getGenders = (payload: ActionCallback): UserActionGetGenders => {
  return {
    type: UserActionType.GET_GENDERS,
    payload,
  };
};

export const getHideAge = (payload: ActionCallback): UserActionGetHideAge => {
  return {
    type: UserActionType.GET_HIDE_AGE,
    payload,
  };
};

// Pause Account
export const pauseAccount = (payload: ActionCallback): UserAction => {
  return {
    type: UserActionType.PAUSE_ACCOUNT,
    payload,
  };
};

// Un-Pause Account
export const unPauseAccount = (payload: ActionCallback): UserAction => {
  return {
    type: UserActionType.UNPAUSE_ACCOUNT,
    payload,
  };
};

// Delete Account
export const deleteAccount = (payload: ActionDeleteAccountPayload): UserAction => {
  return {
    type: UserActionType.DELETE_ACCOUNT,
    payload,
  };
};

// Update Show Me
export const updateShowMe = (payload: { genders: any[]; callback?: ActionCallback }): UserAction => {
  return {
    type: UserActionType.UPDATE_SHOW_ME,
    payload,
  };
};

export const verifyUserPhoto = (data: any, callback?: ActionCallback): UserActionVerifyPhoto => {
  return {
    type: UserActionType.VERIFY_USER_PHOTO,
    payload: {
      data: data,
      callback: callback,
    },
  };
};

export function sendInvite(payload: ActionSendInvitePayload): ActionSendInvite {
  return {
    type: UserActionType.SEND_INVITE,
    payload,
  };
}

export function getListInvited(payload: ActionCallback): ActionGetInvited {
  return {
    type: UserActionType.GET_LIST_INVITED,
    payload,
  };
}

export function checkLivingAuctions(payload: ActionCallback): UserActionCheckLivingAuctions {
  return {
    type: UserActionType.CHECK_LIVING_AUCTIONS,
    payload,
  };
}

export function updateAppLanguage(payload: UpdateAppLanguagePayload): UserActionUpdateAppLanguage {
  return {
    type: UserActionType.UPDATE_APP_LANGUAGE,
    payload,
  };
}

export function saveLastLocation(payload: ActionSaveLastLocationPayload): ActionSaveLastLocation {
  return {
    type: UserActionType.SAVE_LAST_LOCATION,
    payload,
  };
}
