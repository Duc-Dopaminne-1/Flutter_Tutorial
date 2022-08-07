import * as actions from './actions';
import { Action } from 'redux';
import authSaga from './saga';
import reducer from './reducer';
import { UserProfileParams, CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';
import { UserRegisterParams } from '@goldfishcode/noir-caesar-api-sdk/libs/api/auth/adapter/adapter';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IVideoModel, IAudioModel } from '@src/models/media';
import { IPersonType } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { CreateStoryData } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv';
import { PreSignedUrlParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/upload/adapter/adapter';
import { IUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { IActionResetAllState, IActionCallback, IError } from '../base';

// Action Types
export enum ActionTypes {
  LOGIN = 'AUTH_LOGIN',
  SIGN_UP = 'AUTH_SIGN_UP',
  LOG_OUT = 'AUTH_LOG_OUT',
  GET_AUTH_TOKEN = 'GET_AUTH_TOKEN',
  GET_CURRENT_USER = 'GET_CURRENT_USER',
  SAVE_USER = 'SAVE_USER',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  UPDATE_TOKEN = 'UPDATE_TOKEN',
  IS_AUTHENTICATED = 'IS_AUTHENTICATED',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  UPLOAD_AVATAR = 'UPLOAD_AVATAR',
  UPLOAD_COLLECTION = 'UPLOAD_COLLECTION',
  UPLOAD_VIDEO_OR_AUDIO = 'UPLOAD_VIDEO_OR_AUDIO',
  LIST_COLLECTION = 'LIST_COLLECTION',
  SAVE_LIST_BOOK = 'SAVE_LIST_BOOK',
  SAVE_LOAD_MORE_LIST_BOOK = 'SAVE_LOAD_MORE_LIST_BOOK',
  SAVE_LIST_VIDEO = 'SAVE_LIST_VIDEO',
  SAVE_LOAD_MORE_LIST_VIDEO = 'SAVE_LOAD_MORE_LIST_VIDEO',
  SAVE_LIST_AUDIO = 'SAVE_LIST_AUDIO',
  SAVE_LOAD_MORE_LIST_AUDIO = 'SAVE_LOAD_MORE_LIST_AUDIO',
  GET_PERSON_TYPES = 'GET_PERSON_TYPES',
  SAVE_LIST_PERSON_TYPES = 'SAVE_LIST_PERSON_TYPES'
}

// Models
export interface IOauthToken {
  accessToken?: string;
  refreshToken?: string;
}

// State
export interface IAuthState {
  tryAuthDone: boolean;
  logging: boolean;
  user?: any;
  error?: IError;
}

// Payload
export interface IActionLoginPayload extends IActionCallback {
  email: string;
  password: string;
}

export interface IActionSignUpPayload extends IActionCallback {
  body: UserRegisterParams;
}

export interface IActionSaveUserPayload {
  user: IUser;
}

export interface IActionUpdateProfilePayload extends IActionCallback {
  data: UserProfileParams;
}

export interface IActionChangePasswordPayload extends IActionCallback {
  newPassword: string;
}

export interface IActionResetPasswordPayload extends IActionCallback {
  email: string;
}

export interface IActionUploadCollectionPayload extends IActionCallback {
  file: any;
  presignedPost: PreSignedUrlParam;
  callback?: (percentage: number) => void;
}

export interface IActionUploadVideoOrAudioPayload extends IActionCallback {
  data: CreateStoryData;
}

export interface IActionListCollectionPayload extends IActionCallback {
  type: CategoryCollectionEnum;
  page?: number;
  limit?: number;
}

export interface IActionSaveListCollectionPayload extends IActionCallback {
  results: IPagination<any>;
}

export interface IActionSaveLoadMoreBookPayload extends IActionCallback {
  results: IPagination<IBook>;
}

export interface IActionSaveLoadMoreVideoPayload extends IActionCallback {
  results: IPagination<IVideoModel>;
}

export interface IActionSaveLoadMoreAudioPayload extends IActionCallback {
  results: IPagination<IAudioModel>;
}

export interface IActionSaveListPersonPayload extends IActionCallback {
  results: Array<IPersonType>
}

// Actions
export interface IActionLogin extends Action {
  type: ActionTypes.LOGIN;
  payload: IActionLoginPayload;
}

export interface IActionSignUp extends Action {
  type: ActionTypes.SIGN_UP;
  payload: IActionSignUpPayload;
}

export interface IActionLogout extends Action {
  type: ActionTypes.LOG_OUT;
  payload: IActionCallback;
}

export interface IActionGetAuthToken extends Action {
  type: ActionTypes.GET_AUTH_TOKEN;
}

export interface IActionSaveUser extends Action {
  type: ActionTypes.SAVE_USER;
  payload: IActionSaveUserPayload;
}

export interface IActionGetCurrentUser extends Action {
  type: ActionTypes.GET_CURRENT_USER;
  payload: IActionCallback;
}

export interface IActionGetPersonTypes extends Action {
  type: ActionTypes.GET_PERSON_TYPES;
  payload: IActionCallback;
}

export interface IActionSaveListPersonTypes extends Action {
  type: ActionTypes.SAVE_LIST_PERSON_TYPES;
  payload: IActionSaveListPersonPayload;
}


export interface IActionRefreshToken extends Action {
  type: ActionTypes.REFRESH_TOKEN;
  payload: IActionCallback;
}

export interface IActionUpdateToken extends Action {
  type: ActionTypes.UPDATE_TOKEN;
}

export interface IActionIsAuthenticated extends Action {
  type: ActionTypes.IS_AUTHENTICATED;
  payload: IActionCallback;
}

export interface IActionUpdateProfile extends Action {
  type: ActionTypes.UPDATE_PROFILE;
  payload: IActionUpdateProfilePayload;
}

export interface IActionChangePassword extends Action {
  type: ActionTypes.CHANGE_PASSWORD;
  payload: IActionChangePasswordPayload;
}

export interface IActionResetPassword extends Action {
  type: ActionTypes.RESET_PASSWORD;
  payload: IActionResetPasswordPayload;
}

export interface IActionUploadCollection extends Action {
  type: ActionTypes.UPLOAD_COLLECTION;
  payload: IActionUploadCollectionPayload;
}

export interface IActionUploadVideoOrAudio extends Action {
  type: ActionTypes.UPLOAD_VIDEO_OR_AUDIO;
  payload: IActionUploadVideoOrAudioPayload;
}

export interface IActionListCollection extends Action {
  type: ActionTypes.LIST_COLLECTION;
  payload: IActionListCollectionPayload;
}

export interface IActionSaveListCollection extends Action {
  type: ActionTypes.SAVE_LIST_BOOK;
  payload: IActionSaveListCollectionPayload;
}

export interface IActionSaveListVideo extends Action {
  type: ActionTypes.SAVE_LIST_VIDEO;
  payload: IActionSaveListCollectionPayload;
}

export interface IActionSaveListAudio extends Action {
  type: ActionTypes.SAVE_LIST_AUDIO;
  payload: IActionSaveListCollectionPayload;
}

export interface IActionSaveLoadMoreListBook extends Action {
  type: ActionTypes.SAVE_LOAD_MORE_LIST_BOOK;
  payload: IActionSaveLoadMoreBookPayload;
}

export interface IActionSaveLoadMoreListVideo extends Action {
  type: ActionTypes.SAVE_LOAD_MORE_LIST_VIDEO;
  payload: IActionSaveLoadMoreVideoPayload;
}

export interface IActionSaveLoadMoreListAudio extends Action {
  type: ActionTypes.SAVE_LOAD_MORE_LIST_AUDIO;
  payload: IActionSaveLoadMoreAudioPayload;
}

export type IAuthAction =
  | IActionLogin
  | IActionSignUp
  | IActionLogout
  | IActionGetAuthToken
  | IActionSaveUser
  | IActionGetCurrentUser
  | IActionRefreshToken
  | IActionUpdateToken
  | IActionIsAuthenticated
  | IActionResetAllState
  | IActionUpdateProfile
  | IActionChangePassword
  | IActionResetPassword
  | IActionUploadVideoOrAudio
  | IActionListCollection
  | IActionSaveListCollection
  | IActionSaveLoadMoreListBook
  | IActionSaveListVideo
  | IActionSaveLoadMoreListVideo
  | IActionSaveListAudio
  | IActionSaveLoadMoreListAudio
  | IActionGetPersonTypes
  | IActionSaveListPersonTypes;

export { actions, reducer, authSaga };
