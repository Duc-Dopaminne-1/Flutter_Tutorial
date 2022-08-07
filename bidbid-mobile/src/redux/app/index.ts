import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
import { AppSetting } from '@/models/app';

export interface AppState {
  status: AppActionType;
  setting: AppSetting;
  isEnableLocation: boolean;
  locale: string | null;
}

export enum AppActionType {
  MOUNTED = 'MOUNTED',
  INIT = 'APP_INIT',
  INITED = 'APP_INITED',
  READY = 'READY',
  LOG_OUT = 'LOG_OUT',
  RELOAD = 'APP_RELOAD',
  GET_SETTING_DEFAULT = 'GET_SETTING_DEFAULT',
  SAVE_SETTING_DEFAULT = 'SAVE_SETTING_DEFAULT',
  UPDATE_SETTING_DEFAULT = 'UPDATE_SETTING_DEFAULT',
  UPDATE_SETTING_REVIEW = 'UPDATE_SETTING_REVIEW',
  GET_COUNTRY_CODE = 'GET_COUNTRY_CODE',
  UPDATE_SETTING_MEET_GREAT_PERSON = 'UPDATE_SETTING_MEET_GREAT_PERSON',
  UPDATE_SETTING_MEET_GREAT_VIRTUAL = 'UPDATE_SETTING_MEET_GREAT_VIRTUAL',

  SET_PERMISSION_LOCATION = 'SET_PERMISSION_LOCATION',

  CHANGE_LOCALE = 'CHANGE_LOCALE',
}

export interface AppActionInit extends Action {
  type: AppActionType.INIT;
}

export interface AppActionInited extends Action {
  type: AppActionType.INITED;
  payload: any;
}

export interface AppActionReady extends Action {
  type: AppActionType.READY;
}

export interface AppGetSettingDefault extends Action {
  type: AppActionType.GET_SETTING_DEFAULT;
}

export interface AppSaveSettingDefaultPayload extends ActionCallback {
  data: any;
}

export interface AppSaveSettingDefault extends Action {
  type: AppActionType.SAVE_SETTING_DEFAULT;
  payload: AppSaveSettingDefaultPayload;
}

export interface AppUpdateSettingDefaultPayload extends ActionCallback {
  data: any;
}

export interface AppUpdateSettingDefault extends Action {
  type: AppActionType.UPDATE_SETTING_DEFAULT;
  payload: AppUpdateSettingDefaultPayload;
}

export interface AppUpdateSettingReviewPayload extends ActionCallback {
  data: any;
}

export interface AppUpdateSettingMeetGreatPersonPayload extends ActionCallback {
  data: any;
}

export interface AppUpdateSettingMeetGreatPerson extends Action {
  type: AppActionType.UPDATE_SETTING_MEET_GREAT_PERSON;
  payload: AppUpdateSettingMeetGreatPersonPayload;
}

export interface AppUpdateSettingMeetGreatVirtualPayload extends ActionCallback {
  data: any;
}

export interface AppGetCountryCodePayload extends ActionCallback {
  data?: any;
}

export interface AppGetCountryCode extends Action {
  type: AppActionType.GET_COUNTRY_CODE;
  payload: AppGetCountryCodePayload;
}

export interface AppUpdateSettingReview extends Action {
  type: AppActionType.UPDATE_SETTING_REVIEW;
  payload: AppUpdateSettingReviewPayload;
}

export interface AppUpdateSettingMeetGreatVirtual extends Action {
  type: AppActionType.UPDATE_SETTING_MEET_GREAT_VIRTUAL;
  payload: AppUpdateSettingMeetGreatVirtualPayload;
}

export interface AppActionLogout extends Action {
  type: AppActionType.LOG_OUT;
}

export interface AppActionReload extends Action {
  type: AppActionType.RELOAD;
}
export interface AppActionSetPermissionLocation extends Action {
  type: AppActionType.SET_PERMISSION_LOCATION;
  payload: {
    isEnable: boolean;
  };
}
export interface AppActionChangeLocale extends Action {
  type: AppActionType.CHANGE_LOCALE;
  payload: {
    locale: string;
  };
}

export type AppAction =
  | AppSaveSettingDefault
  | AppActionInit
  | AppActionInited
  | AppUpdateSettingReview
  | AppUpdateSettingMeetGreatVirtual
  | AppUpdateSettingMeetGreatPerson
  | AppActionReady
  | AppActionLogout
  | AppGetCountryCode
  | AppActionReload
  | AppUpdateSettingDefault
  | AppActionSetPermissionLocation
  | AppActionChangeLocale;
