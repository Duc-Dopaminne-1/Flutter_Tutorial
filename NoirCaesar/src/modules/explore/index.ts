import { Action } from 'redux';
import reducer from './reducer';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IEpisode, IStory, IStorySlider } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';

export enum ActionTypes {
  EPISODE_LIST = 'EPISODE_LIST',
  SAVE_EPISODE_LIST = 'SAVE_EPISODE_LIST',
  LOAD_MORE_EPISODE_LIST = 'LOAD_MORE_EPISODE_LIST',
  GET_SUGGESTION_EXPLORE = 'GET_SUGGESTION_EXPLORE',
  EXPLORE_LIST = 'EXPLORE_LIST',
  SAVE_EXPLORE_LIST = 'SAVE_EXPLORE_LIST',
  LOAD_MORE_EXPLORE_LIST = 'LOAD_MORE_EXPLORE_LIST',
  CLEAR_EXPLORE_LIST = 'CLEAR_EXPLORE_LIST',
  GET_EXPLORE_SLIDER = 'GET_EXPLORE_SLIDER',
  SAVE_EXPLORE_SLIDER = 'SAVE_EXPLORE_SLIDER'
}

export interface IExploreState {
  listEpisode: IPagination<IEpisode>;
  listExplore: IPagination<IBook | IEpisode | IStory>;
  listSlider: Array<IBook | IStorySlider>;
}

// ===================PAYLOADS=========================

export interface IActionGetEpisodeListPayload extends IActionCallback {
  story_id: string;
  page?: number;
  limit?: number;
}

export interface IActionGetExploreListPayload extends IActionCallback {
  name: string;
  page?: number;
  limit?: number;
}

export type IActionGetSuggestExploreListPayload = IActionCallback;

export interface IActionSaveEpisodeListPayload {
  results: IPagination<IEpisode>;
}

export interface IActionSaveExploreListPayload {
  results: IPagination<IEpisode>;
}

export interface IActionLoadMoreEpisodeListPayload {
  results: IPagination<IEpisode>;
}

export interface IActionLoadMoreExploreListPayload {
  results: IPagination<IEpisode>;
}

export interface IActionSaveExploreSliderPayload {
  results: Array<IBook | IStorySlider>;
}

// ===================ACTIONS===================================================

export interface IActionGetEpisodeList extends Action {
  type: ActionTypes.EPISODE_LIST;
  payload: IActionGetEpisodeListPayload;
}

export interface IActionSaveEpisodeList extends Action {
  type: ActionTypes.SAVE_EPISODE_LIST;
  payload: IActionSaveEpisodeListPayload;
}

export interface IActionSaveExploreList extends Action {
  type: ActionTypes.SAVE_EXPLORE_LIST;
  payload: IActionSaveExploreListPayload;
}

export interface IActionLoadMoreEpisodeList extends Action {
  type: ActionTypes.LOAD_MORE_EPISODE_LIST;
  payload: IActionLoadMoreEpisodeListPayload;
}

export interface IActionLoadMoreExoloreList extends Action {
  type: ActionTypes.LOAD_MORE_EXPLORE_LIST;
  payload: IActionLoadMoreExploreListPayload;
}

export interface IActionGetSuggestExploreList extends Action {
  type: ActionTypes.GET_SUGGESTION_EXPLORE;
  payload: IActionGetSuggestExploreListPayload;
}

export interface IActionGetExploreList extends Action {
  type: ActionTypes.EXPLORE_LIST;
  payload: IActionGetExploreListPayload;
}

export interface IActionClearExploreList extends Action {
  type: ActionTypes.CLEAR_EXPLORE_LIST;
}

export interface IActionGetExploreSlider extends Action {
  type: ActionTypes.GET_EXPLORE_SLIDER;
  payload: IActionCallback;
}

export interface IActionSaveExploreSlider extends Action {
  type: ActionTypes.SAVE_EXPLORE_SLIDER;
  payload: IActionSaveExploreSliderPayload;
}

export type IActionExplore =
  | IActionGetEpisodeList
  | IActionResetAllState
  | IActionSaveEpisodeList
  | IActionLoadMoreEpisodeList
  | IActionGetExploreList
  | IActionGetSuggestExploreList
  | IActionSaveExploreList
  | IActionLoadMoreExoloreList
  | IActionClearExploreList
  | IActionGetExploreSlider
  | IActionSaveExploreSlider;

export { reducer };
