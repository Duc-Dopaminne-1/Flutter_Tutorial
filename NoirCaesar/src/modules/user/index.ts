import { Action } from 'redux';
import reducer from './reducer';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { IUserProfile } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IVideoModel, IAudioModel } from '@src/models/media';
import { CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';

export enum ActionTypes {
  GET_PROFILE_DETAIL = 'GET_PROFILE_DETAIL',
  SAVE_PROFILE_DETAIL = 'SAVE_PROFILE_DETAIL',
  LIST_RETRIEVE_COLLECTION = 'LIST_RETRIEVE_COLLECTION',
  SAVE_USER_LIST_BOOK = 'SAVE_USER_LIST_BOOK',
  SAVE_USER_LIST_VIDEO = 'SAVE_USER_LIST_VIDEO',
  SAVE_USER_LIST_AUDIO = 'SAVE_USER_LIST_AUDIO',
  SAVE_LOAD_MORE_USER_LIST_BOOK = 'SAVE_LOAD_MORE_USER_LIST_BOOK',
  SAVE_LOAD_MORE_USER_LIST_VIDEO = 'SAVE_LOAD_MORE_USER_LIST_VIDEO',
  SAVE_LOAD_MORE_USER_LIST_AUDIO = 'SAVE_LOAD_MORE_USER_LIST_AUDIO',
  FOLLOW = 'FOLLOW',
  UNFOLLOW = 'UNFOLLOW'
}

export interface IUserState {
  profileDetail: IUserProfile;
  listUserBook: IPagination<IBook>;
  listUserVideo: IPagination<IVideoModel>;
  listUserAudio: IPagination<IEpisode>;
}

export interface IListUserState {
  [id: string]: IUserState
}

// Payloads

export interface IActionGetProfilePayload extends IActionCallback {
  user_id: string;
}

export interface IActionSaveProfilePayload {
  user_id: string;
  profileDetail: IUserProfile;
}

export interface IActionListRetrieveCollectionPayload extends IActionCallback {
  user_id: string;
  type: CategoryCollectionEnum;
  page?: number;
  limit?: number;
}

export interface IActionSaveListContentPayload extends IActionCallback {
  user_id: string;
  results: IPagination<any>;
}

export interface IActionSaveLoadMoreBookPayload extends IActionCallback {
  user_id: string;
  results: IPagination<IBook>;
}

export interface IActionSaveLoadMoreVideoPayload extends IActionCallback {
  user_id: string;
  results: IPagination<IVideoModel>;
}

export interface IActionSaveLoadMoreAudioPayload extends IActionCallback {
  user_id: string;
  results: IPagination<IAudioModel>;
}

export interface IActionFollowPayload extends IActionCallback {
  user_id: string;
}

export interface IActionUnfollowPayload extends IActionCallback {
  user_id: string;
}

// Actions

export interface IActionGetProfile extends Action {
  type: ActionTypes.GET_PROFILE_DETAIL;
  payload: IActionGetProfilePayload;
}

export interface IActionSaveProfile extends Action {
  type: ActionTypes.SAVE_PROFILE_DETAIL;
  payload: IActionSaveProfilePayload;
}

export interface IActionListRetrieveCollection extends Action {
  type: ActionTypes.LIST_RETRIEVE_COLLECTION;
  payload: IActionListRetrieveCollectionPayload;
}

export interface IActionSaveListBook extends Action {
  type: ActionTypes.SAVE_USER_LIST_BOOK;
  payload: IActionSaveListContentPayload;
}

export interface IActionSaveListVideo extends Action {
  type: ActionTypes.SAVE_USER_LIST_VIDEO;
  payload: IActionSaveListContentPayload;
}

export interface IActionSaveListAudio extends Action {
  type: ActionTypes.SAVE_USER_LIST_AUDIO;
  payload: IActionSaveListContentPayload;
}

export interface IActionSaveLoadMoreListBook extends Action {
  type: ActionTypes.SAVE_LOAD_MORE_USER_LIST_BOOK;
  payload: IActionSaveLoadMoreBookPayload;
}

export interface IActionSaveLoadMoreListVideo extends Action {
  type: ActionTypes.SAVE_LOAD_MORE_USER_LIST_VIDEO;
  payload: IActionSaveLoadMoreVideoPayload;
}

export interface IActionSaveLoadMoreListAudio extends Action {
  type: ActionTypes.SAVE_LOAD_MORE_USER_LIST_AUDIO;
  payload: IActionSaveLoadMoreAudioPayload;
}

export interface IActionFollow extends Action {
  type: ActionTypes.FOLLOW;
  payload: IActionFollowPayload;
}

export interface IActionUnfollow extends Action {
  type: ActionTypes.UNFOLLOW;
  payload: IActionUnfollowPayload;
}

export type IActionUser =
  | IActionGetProfile
  | IActionSaveProfile
  | IActionListRetrieveCollection
  | IActionSaveListBook
  | IActionSaveListVideo
  | IActionSaveListAudio
  | IActionSaveLoadMoreListBook
  | IActionSaveLoadMoreListVideo
  | IActionSaveLoadMoreListAudio
  | IActionFollow
  | IActionUnfollow
  | IActionResetAllState;

export { reducer };
