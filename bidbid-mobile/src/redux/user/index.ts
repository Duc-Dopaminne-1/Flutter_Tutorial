import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
import { PHOTO, PHOTO_CREATE_PAYLOAD, PHOTO_DELETE_PAYLOAD } from '@/models/photo';
import { Gender, GENDER_TYPE } from '@/models/gender';
import { SEXUAL_ORIENTATION_MODEL } from '@/models/sexual-orirentation';
import { SCHOOL_MODEL } from '@/models/school';
import { LANGUAGE_MODEL } from '@/models/language';
import { INTERESTS_MODEL } from '@/models/interests';
import { City } from '@/models/city';
import { Payment } from '@/models/payment';
import { Auction } from '@/models/auction';
import { JOB_MODEL } from '@/models/job';
import { COMPANY_MODEL } from '@/models/company';
import { CAREER_STRENGTHS, CATEGORIES } from '@/models';

export enum UserActionType {
  SEND_INVITE = 'SEND_INVITE',
  GET_LIST_INVITED = 'GET_LIST_INVITED',
  UPDATE_USER = 'UPDATE_USER',
  GET_INTERESTS = 'GET_INTERESTS',
  GET_CAREER_STRENGTHS = 'CAREER_STRENGTHS',
  LOAD_USER_DATA = 'LOAD_USER_DATA',

  GET_USER_PROFILE = 'GET_USER_PROFILE',
  SAVE_USER = 'SAVE_USER',
  CREATE_PHOTO = 'CREATE_PHOTO',
  UPDATE_PHOTO = 'UPDATE_PHOTO',
  SAVE_LAST_LOCATION = 'SAVE_LAST_LOCATION',
  CHANGE_PHOTO_TO_AVATAR = 'CHANGE_PHOTO_TO_AVATAR',
  DELETE_PHOTO = 'DELETE_PHOTO',
  UPDATE_GENDER = 'UPDATE_GENDER',

  GET_SEXUAL_ORIENTATION = 'GET_SEXUAL_ORIENTATION',
  UPDATE_SEXUAL_ORIENTATION = 'UPDATE_SEXUAL_ORIENTATION',

  GET_COMPANY = 'GET_COMPANY',
  UPDATE_COMPANY = 'UPDATE_COMPANY',
  CREATE_COMPANY = 'CREATE_COMPANY',

  GET_JOBS = 'GET_JOBS',
  UPDATE_JOB = 'UPDATE_JOB',
  CREATE_JOB = 'CREATE_JOB',

  GET_SCHOOLS = 'GET_SCHOOLS',
  UPDATE_SCHOOL = 'UPDATE_SCHOOL',
  CREATE_SCHOOL = 'CREATE_SCHOOL',

  GET_LANGUAGES = 'GET_LANGUAGES',
  UPDATE_LANGUAGES = 'UPDATE_LANGUAGES',

  UPDATE_ABOUT_ME = 'UPDATE_ABOUT_ME',
  UPDATE_HIDE_AGE = 'UPDATE_HIDE_AGE',
  UPDATE_JOB_TITLE = 'UPDATE_JOB_TITLE',

  UPDATE_INSTAGRAM_USERNAME = 'UPDATE_INSTAGRAM_USERNAME',
  UPDATE_USERNAME = 'UPDATE_USERNAME',

  CREATE_CITY = 'CREATE_CITY',
  UPDATE_CITY = 'UPDATE_CITY',

  LOG_OUT = 'LOG_OUT',
  GET_GENDERS = 'GET_GENDERS',
  GET_HIDE_AGE = 'GET_HIDE_AGE',

  PAUSE_ACCOUNT = 'PAUSE_ACCOUNT',
  UNPAUSE_ACCOUNT = 'UNPAUSE_ACCOUNT',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',

  UPDATE_SHOW_ME = 'UPDATE_SHOW_ME',

  VERIFY_USER_PHOTO = 'VERIFY_USER_PHOTO',

  CHECK_LIVING_AUCTIONS = 'CHECK_LIVING_AUCTIONS',

  UPDATE_APP_LANGUAGE = 'UPDATE_APP_LANGUAGE',
  UPDATE_PROFILE_PICTURE = 'UPDATE_PROFILE_PICTURE',
}

export interface USER {
  id: string;
  avatarId: number;
  phoneNumber: string;
  email: string;
  token: null;
  payoutMethodId: number;
  status: string;
  firstName: string;
  lastName: string;
  hideAge: boolean;
  dateOfBirth: string;
  genderId: number;
  likes: number;
  languageId: any;
  appLanguage: string;
  city: City;
  paymentMethodId: number;
  gender: Gender;
  avatar: PHOTO;
  photos: PHOTO[];
  thumbnailId: string;
  paymentMethod?: Payment;
  authProviders: any;
  sexualOrientations: SEXUAL_ORIENTATION_MODEL[];
  isShowSexual: boolean;
  school?: SCHOOL_MODEL;
  languages: LANGUAGE_MODEL[];
  instagramUsername: string;

  description?: string;
  job: JOB_MODEL;

  interests: INTERESTS_MODEL[];
  strengths: CAREER_STRENGTHS[];
  categories: CATEGORIES[];
  company: COMPANY_MODEL;

  auctions: Auction[];

  pauses: any;
  showMe?: any;
  showMeIds?: any[];
  showMeNames?: any[];
}

export interface UserState {
  data: USER;
}

export interface ActionUpdateUserPayload extends ActionCallback {
  interestIds?: any[];
  strengthIds?: any[];
  categoryIds?: any[];
  userId: string;
}

export interface UserActionUpdateUser extends Action {
  type: UserActionType.UPDATE_USER;
  payload: ActionUpdateUserPayload;
}

export interface UserActionGetCareerStrengths extends Action {
  type: UserActionType.GET_CAREER_STRENGTHS;
  payload: ActionCallback;
}

export interface UserActionGetInterestsPayload extends ActionCallback {
  isFromRegister?: boolean;
}

export interface UserActionGetInterests extends Action {
  type: UserActionType.GET_INTERESTS;
  payload: UserActionGetInterestsPayload;
}

export interface UserActionGetProfile extends Action {
  type: UserActionType.GET_USER_PROFILE;
  payload: ActionCallback;
}

export interface UserActionLoadUserData extends Action {
  type: UserActionType.LOAD_USER_DATA;
  payload: ActionCallback;
}

export interface UserActionSaveUser extends Action {
  type: UserActionType.SAVE_USER;
  payload: USER;
}

export interface UserActionCreatePhoto extends Action {
  type: UserActionType.CREATE_PHOTO;
  payload: PHOTO_CREATE_PAYLOAD;
}

export interface UserActionVerifyPhoto extends Action {
  type: UserActionType.VERIFY_USER_PHOTO;
  payload: {
    data: any;
    callback: ActionCallback;
  };
}

export interface UserActionUpdatePhoto extends Action {
  type: UserActionType.UPDATE_PHOTO;
  payload: {
    photoId: number;
    data: any;
  };
}

export interface UserActionUpdateProfilePicture extends Action {
  type: UserActionType.UPDATE_PROFILE_PICTURE;
  payload: {
    data: any;
    callback?: ActionCallback;
  };
}

export interface UserActionChangePhotoToAvatar extends Action {
  type: UserActionType.CHANGE_PHOTO_TO_AVATAR;
  payload: {
    photoId: number;
  };
}

export interface UserActionDeletePhoto extends Action {
  type: UserActionType.DELETE_PHOTO;
  payload: PHOTO_DELETE_PAYLOAD;
}

export interface UserActionDeletePhoto extends Action {
  type: UserActionType.DELETE_PHOTO;
  payload: PHOTO_DELETE_PAYLOAD;
}

export interface UserActionUpdateGender extends Action {
  type: UserActionType.UPDATE_GENDER;
  payload: GENDER_TYPE;
}
export interface UserActionUpdateHideAge extends Action {
  type: UserActionType.UPDATE_HIDE_AGE;
  payload: { hideAge: boolean };
}

export interface UpdateHideAgePayload extends ActionCallback {
  hideAge: boolean;
  userId: string;
}

export interface UpdateAppLanguagePayload extends ActionCallback {
  appLanguage: string;
  userId: string;
}

export interface UserActionGetSexualOrientations extends Action {
  type: UserActionType.GET_SEXUAL_ORIENTATION;
  payload: ActionCallback;
}

export interface UserActionUpdateSexualOrientations extends Action {
  type: UserActionType.UPDATE_SEXUAL_ORIENTATION;
  payload: {
    sexualOrientations: number[];
    callback?: ActionCallback;
  };
}

export interface UserActionGetCompany extends Action {
  type: UserActionType.GET_COMPANY;
  payload: {
    keyWork: string;
    currentPage: number;
    perPage: number;
    callback: ActionCallback;
  };
}

export interface UserActionUpdateCompany extends Action {
  type: UserActionType.UPDATE_COMPANY;
  payload: {
    companyId: number;
  };
}

export interface UserActionCreateCompany extends Action {
  type: UserActionType.CREATE_COMPANY;
  payload: {
    name: string;
  };
}

export interface UserActionGetJobs extends Action {
  type: UserActionType.GET_JOBS;
  payload: {
    keyWork: string;
    currentPage: number;
    perPage: number;
    callback: ActionCallback;
  };
}

export interface UserActionUpdateJob extends Action {
  type: UserActionType.UPDATE_JOB;
  payload: {
    jobId: number;
  };
}

export interface UserActionCreateJob extends Action {
  type: UserActionType.CREATE_JOB;
  payload: {
    name: string;
  };
}

export interface UserActionGetSchools extends Action {
  type: UserActionType.GET_SCHOOLS;
  payload: {
    keyWork: string;
    currentPage: number;
    perPage: number;
    callback: ActionCallback;
  };
}

export interface UserActionUpdateSchool extends Action {
  type: UserActionType.UPDATE_SCHOOL;
  payload: {
    schoolId: number;
  };
}

export interface UserActionCreateSchool extends Action {
  type: UserActionType.CREATE_SCHOOL;
  payload: {
    name: string;
  };
}

export interface UserActionUpdateLanguages extends Action {
  type: UserActionType.UPDATE_LANGUAGES;
  payload: {
    languages: LANGUAGE_MODEL[];
    callback?: ActionCallback;
  };
}

export interface UserActionGetLanguages extends Action {
  type: UserActionType.GET_LANGUAGES;
  payload: ActionCallback;
}

export interface UserActionUpdateAboutMe extends Action {
  type: UserActionType.UPDATE_ABOUT_ME;
  payload: string;
}

export interface UserActionUpdateJobTitle extends Action {
  type: UserActionType.UPDATE_JOB_TITLE;
  payload: string;
}

export interface UserActionUpdateInstagramUsername extends Action {
  type: UserActionType.UPDATE_INSTAGRAM_USERNAME;
  payload: string;
}

export interface UserActionUpdateUsername extends Action {
  type: UserActionType.UPDATE_USERNAME;
  payload: UserActionUpdateUserNamePayload;
}

export interface UserActionCreateCityPayload extends ActionCallback {
  name: string;
  address: string;
  lng: number;
  lat: number;
  city: string;
  country: string;
}

export interface UserActionUpdateUserNamePayload extends ActionCallback {
  firstName: string;
  lastName: string;
}

export interface UserActionUpdateCityPayload extends ActionCallback, UserActionCreateCityPayload {
  locationId?: number;
}

export interface UserActionCreateCity extends Action {
  type: UserActionType.CREATE_CITY;
  payload: UserActionCreateCityPayload;
}

export interface UserActionUpdateCity extends Action {
  type: UserActionType.UPDATE_CITY;
  payload: UserActionUpdateCityPayload;
}

export interface UserActionLogout extends Action {
  type: UserActionType.LOG_OUT;
}
export interface UserActionGetGenders extends Action {
  type: UserActionType.GET_GENDERS;
  payload: ActionCallback;
}
export interface UserActionGetHideAge extends Action {
  type: UserActionType.GET_HIDE_AGE;
  payload: ActionCallback;
}

export interface UserPauseAccount extends Action {
  type: UserActionType.PAUSE_ACCOUNT;
  payload: ActionCallback;
}

export interface UserUnPauseAccount extends Action {
  type: UserActionType.UNPAUSE_ACCOUNT;
  payload: ActionCallback;
}

export interface ActionDeleteAccountPayload extends ActionCallback {
  userId: string;
  reason: string;
  note?: string;
}

export interface UserDeleteAccount extends Action {
  type: UserActionType.DELETE_ACCOUNT;
  payload: ActionDeleteAccountPayload;
}

export interface UserUpdateShowMe extends Action {
  type: UserActionType.UPDATE_SHOW_ME;
  payload: {
    genders: any[];
    callback?: ActionCallback;
  };
}

export interface ActionSaveLastLocationPayload extends ActionCallback {
  lat: string;
  lng: string;
}

export interface ActionSaveLastLocation extends Action {
  type: UserActionType.SAVE_LAST_LOCATION;
  payload: ActionSaveLastLocationPayload;
}

export interface ActionSendInvitePayload extends ActionCallback {
  phoneNumbers: string[];
}

export interface ActionSendInvite extends Action {
  type: UserActionType.SEND_INVITE;
  payload: ActionSendInvitePayload;
}

export interface ActionGetInvited extends Action {
  type: UserActionType.GET_LIST_INVITED;
  payload: ActionCallback;
}

export interface UserActionCheckLivingAuctions extends Action {
  type: UserActionType.CHECK_LIVING_AUCTIONS;
  payload: ActionCallback;
}

export interface UserActionUpdateAppLanguage extends Action {
  type: UserActionType.UPDATE_APP_LANGUAGE;
  payload: {
    appLanguage: string;
    callback?: ActionCallback;
  };
}

export type UserAction =
  | UserActionLoadUserData
  | UserActionGetProfile
  | UserActionSaveUser
  | UserActionCreatePhoto
  | UserActionUpdatePhoto
  | UserActionDeletePhoto
  | UserActionGetSexualOrientations
  | UserActionUpdateSexualOrientations
  | UserActionGetSchools
  | UserActionUpdateSchool
  | UserActionCreateSchool
  | UserActionGetLanguages
  | UserActionUpdateLanguages
  | UserActionUpdateAboutMe
  | UserActionUpdateInstagramUsername
  | UserActionCreateCity
  | UserActionUpdateCity
  | UserActionLogout
  | UserActionUpdateJobTitle
  | UserPauseAccount
  | UserUnPauseAccount
  | UserDeleteAccount
  | UserUpdateShowMe
  | UserActionVerifyPhoto
  | UserActionCheckLivingAuctions;
