import { Action } from 'redux';
import reducer from './reducer';
import { IActionCallback, IActionResetAllState } from '@src/modules/base';
import { ICategory, IStory, IStorySlider, IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';

export enum ActionTypes {
  UPDATE_REPEAT_STATE = 'UPDATE_REPEAT_STATE',
  UPDATE_SHUFFLE_STATE = 'UPDATE_SHUFFLE_STATE',
  GET_CATEGORIES = 'GET_CATEGORIES',
  SAVE_CATEGORIES = 'SAVE_CATEGORIES',
  GET_SLIDER = 'GET_SLIDER',
  SAVE_SLIDER = 'SAVE_SLIDER',
  GET_STORIES = 'GET_STORIES',
  SAVE_STORIES = 'SAVE_STORIES',
  LOAD_MORE_STORIES = 'LOAD_MORE_STORIES',
  DETAIL_STORY = 'DETAIL_STORY',
  GET_EPISODE_DETAIL = 'GET_EPISODE_DETAIL',
  SAVE_EPISODE_DETAIL = 'SAVE_EPISODE_DETAIL',
  GET_SUGGEST_EPISODE = 'GET_SUGGEST_EPISODE',
  SAVE_SUGGEST_EPISODE = 'SAVE_SUGGEST_EPISODE',
  LOAD_MORE_SUGGEST_EPISODE = 'LOAD_MORE_SUGGEST_EPISODE',
  RESET_MEDIA_DETAIL = 'RESET_MEDIA_DETAIL',
  PURCHASE_EPISODE = 'PURCHASE_EPISODE'
}

export interface IVideoState {
  slider: IStorySlider[];
  list: IPagination<IStory>;
}
export interface ITVState {
  isRepeat: boolean;
  isShuffle: boolean;
  categories: ICategory[];
  animation?: IVideoState;
  film?: IVideoState;
  reviews?: IVideoState;
  news?: IPagination<IStory>;
  podcast?: IPagination<IStory>;
  music?: IPagination<IEpisode>;
  episodeDetail?: IEpisode;
  suggestEpisode?: IPagination<IEpisode>;
}

// ===================PAYLOADS=========================
export interface IActionUpdateRepeatStatePayload {
  state: boolean;
}

export interface IActionUpdateShuffleStatePayload {
  state: boolean;
}

export interface IActionSaveCategoriesPayload {
  results: ICategory[];
}

export interface IActionGetSliderPayload extends IActionCallback {
  cate_id: string;
  type: string;
}

export interface IActionSaveSliderPayload {
  type: string;
  results: IStorySlider[];
}

export interface IActionGetStoriesPayload extends IActionCallback {
  cate_id: string;
  page?: number;
  limit?: number;
  type: string;
}

export interface IActionDetailStoryPayload extends IActionCallback {
  story_id: string;
  is_collection?: boolean;
}

export interface IActionSaveStoriesPayload {
  type: string;
  results: IPagination<IStory | IEpisode>;
}

export interface IActionLoadMoreStoriesPayload {
  type: string;
  results: IPagination<IStory | IEpisode>;
}

export interface IActionGetEpisodeDetailPayload extends IActionCallback {
  episode_id: string;
  is_collection?: boolean;
}

export interface IActionSaveEpisodeDetailPayload {
  results: IEpisode;
}

export interface IActionGetSuggestEpisodePayload extends IActionCallback {
  episode_id: string;
  page?: number;
  limit?: number;
}

export interface IActionSaveSuggestEpisodePayload {
  results: IPagination<IEpisode>;
}

export interface IActionLoadMoreSuggestEpisodePayload {
  results: IPagination<IEpisode>;
}

export interface IActionPurchaseEpisodePayload extends IActionCallback {
  episode_id: string;
}

// ===================ACTIONS===================================================
export interface IActionUpdateRepeatState extends Action {
  type: ActionTypes.UPDATE_REPEAT_STATE;
  payload: IActionUpdateRepeatStatePayload;
}

export interface IActionUpdateShuffleState extends Action {
  type: ActionTypes.UPDATE_SHUFFLE_STATE;
  payload: IActionUpdateShuffleStatePayload;
}

export interface IActionGetCategories extends Action {
  type: ActionTypes.GET_CATEGORIES;
  payload: IActionCallback;
}

export interface IActionSaveCategories extends Action {
  type: ActionTypes.SAVE_CATEGORIES;
  payload: IActionSaveCategoriesPayload;
}

export interface IActionGetSlider extends Action {
  type: ActionTypes.GET_SLIDER;
  payload: IActionGetSliderPayload;
}

export interface IActionSaveSlider extends Action {
  type: ActionTypes.SAVE_SLIDER;
  payload: IActionSaveSliderPayload;
}

export interface IActionGetStories extends Action {
  type: ActionTypes.GET_STORIES;
  payload: IActionGetStoriesPayload;
}

export interface IActionSaveStories extends Action {
  type: ActionTypes.SAVE_STORIES;
  payload: IActionSaveStoriesPayload;
}

export interface IActionLoadMoreStories extends Action {
  type: ActionTypes.LOAD_MORE_STORIES;
  payload: IActionLoadMoreStoriesPayload;
}

export interface IActionDetailStory extends Action {
  type: ActionTypes.DETAIL_STORY;
  payload: IActionDetailStoryPayload;
}

export interface IActionGetEpisodeDetail extends Action {
  type: ActionTypes.GET_EPISODE_DETAIL;
  payload: IActionGetEpisodeDetailPayload;
}

export interface IActionSaveEpisodeDetail extends Action {
  type: ActionTypes.SAVE_EPISODE_DETAIL;
  payload: IActionSaveEpisodeDetailPayload;
}

export interface IActionGetSuggestEpisode extends Action {
  type: ActionTypes.GET_SUGGEST_EPISODE;
  payload: IActionGetSuggestEpisodePayload;
}

export interface IActionSaveSuggestEpisode extends Action {
  type: ActionTypes.SAVE_SUGGEST_EPISODE;
  payload: IActionSaveSuggestEpisodePayload;
}

export interface IActionLoadMoreSuggestEpisode extends Action {
  type: ActionTypes.LOAD_MORE_SUGGEST_EPISODE;
  payload: IActionLoadMoreSuggestEpisodePayload;
}

export interface IActionResetMediaDetail extends Action {
  type: ActionTypes.RESET_MEDIA_DETAIL;
}

export interface IActionPurchaseEpisode extends Action {
  type: ActionTypes.PURCHASE_EPISODE;
  payload: IActionPurchaseEpisodePayload;
}

export type IActionTV =
  | IActionUpdateRepeatState
  | IActionUpdateShuffleState
  | IActionGetCategories
  | IActionSaveCategories
  | IActionGetSlider
  | IActionSaveSlider
  | IActionResetAllState
  | IActionGetStories
  | IActionSaveStories
  | IActionLoadMoreStories
  | IActionDetailStory
  | IActionGetEpisodeDetail
  | IActionSaveEpisodeDetail
  | IActionGetSuggestEpisode
  | IActionSaveSuggestEpisode
  | IActionLoadMoreSuggestEpisode
  | IActionResetMediaDetail
  | IActionPurchaseEpisode;

export { reducer };
