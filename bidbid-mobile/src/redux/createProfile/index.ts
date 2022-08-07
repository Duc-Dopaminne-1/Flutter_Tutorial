import { Action } from 'redux';
import { ActionCallback } from '@/redux/auth';
import { CREATE_PHOTO, LANGUAGE_MODEL } from '@/models';
import { Address } from '@/screens/CreateAuction/component/CreateAuctionPlace';

// Action Types
export enum ActionTypes {
  SAVE_PROFILE = 'SAVE_PROFILE',
  CREATE_PROFILE = 'CREATE_PROFILE',
  UPDATE_LANGUAGE = 'UPDATE_LANGUAGE',
  LOG_OUT = 'LOG_OUT',
}

export interface ActionSaveProfilePayload extends ActionCallback {
  data?: any;
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  hideAge?: boolean;
  genderId?: string;
  instagramUsername?: string;
  photos?: CREATE_PHOTO[];
  career?: number[];
  categories?: number[];
  avatar?: CREATE_PHOTO;
  providerId?: string;
  isSkipPhoneNumber?: boolean;
  city?: Address;
  languages?: LANGUAGE_MODEL[];
}

export interface ActionSaveProfile extends Action {
  type: ActionTypes.SAVE_PROFILE;
  payload: ActionSaveProfilePayload;
}

export interface ActionUpdateLanguage extends Action {
  type: ActionTypes.UPDATE_LANGUAGE;
  payload: ActionSaveProfilePayload;
}

export interface ActionCreateProfile extends Action {
  type: ActionTypes.CREATE_PROFILE;
  payload: ActionSaveProfilePayload;
}

export interface ActionLogout extends Action {
  type: ActionTypes.LOG_OUT;
}

export type CreateProfileAction = ActionSaveProfile | ActionUpdateLanguage | ActionLogout;
