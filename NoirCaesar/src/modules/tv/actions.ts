import {
  ActionTypes,
  IActionUpdateRepeatStatePayload,
  IActionUpdateShuffleStatePayload,
  IActionSaveCategoriesPayload,
  IActionGetSliderPayload,
  IActionSaveSliderPayload,
  IActionGetStoriesPayload,
  IActionSaveStoriesPayload,
  IActionLoadMoreStoriesPayload,
  IActionDetailStoryPayload,
  IActionGetEpisodeDetailPayload,
  IActionSaveEpisodeDetailPayload,
  IActionGetSuggestEpisodePayload,
  IActionSaveSuggestEpisodePayload,
  IActionLoadMoreSuggestEpisodePayload,
  IActionPurchaseEpisodePayload,
} from './index';
import { IActionCallback } from '../base';

const updateRepeatState = (payload: IActionUpdateRepeatStatePayload) => ({
  type: ActionTypes.UPDATE_REPEAT_STATE,
  payload,
});

const updateShuffleState = (payload: IActionUpdateShuffleStatePayload) => ({
  type: ActionTypes.UPDATE_SHUFFLE_STATE,
  payload,
});

const getCategories = (payload: IActionCallback) => ({
  type: ActionTypes.GET_CATEGORIES,
  payload,
});

const saveCategories = (payload: IActionSaveCategoriesPayload) => ({
  type: ActionTypes.SAVE_CATEGORIES,
  payload,
});

const getSlider = (payload: IActionGetSliderPayload) => ({
  type: ActionTypes.GET_SLIDER,
  payload,
});

const saveSlider = (payload: IActionSaveSliderPayload) => ({
  type: ActionTypes.SAVE_SLIDER,
  payload,
});

const getStories = (payload: IActionGetStoriesPayload) => ({
  type: ActionTypes.GET_STORIES,
  payload,
});

const saveStories = (payload: IActionSaveStoriesPayload) => ({
  type: ActionTypes.SAVE_STORIES,
  payload,
});

const loadMoreStories = (payload: IActionLoadMoreStoriesPayload) => ({
  type: ActionTypes.LOAD_MORE_STORIES,
  payload,
});

const detailStory = (payload: IActionDetailStoryPayload) => ({
  type: ActionTypes.DETAIL_STORY,
  payload,
});

const getEpisodeDetail = (payload: IActionGetEpisodeDetailPayload) => ({
  type: ActionTypes.GET_EPISODE_DETAIL,
  payload,
});

const saveEpisodeDetail = (payload: IActionSaveEpisodeDetailPayload) => ({
  type: ActionTypes.SAVE_EPISODE_DETAIL,
  payload,
});

const getSuggestEpisode = (payload: IActionGetSuggestEpisodePayload) => ({
  type: ActionTypes.GET_SUGGEST_EPISODE,
  payload,
});

const saveSuggestEpisode = (payload: IActionSaveSuggestEpisodePayload) => ({
  type: ActionTypes.SAVE_SUGGEST_EPISODE,
  payload,
});

const loadMoreSuggestEpisode = (payload: IActionLoadMoreSuggestEpisodePayload) => ({
  type: ActionTypes.LOAD_MORE_SUGGEST_EPISODE,
  payload,
});

const resetMediaDetail = () => ({
  type: ActionTypes.RESET_MEDIA_DETAIL,
});

const purchaseEpisode = (payload: IActionPurchaseEpisodePayload) => ({
  type: ActionTypes.PURCHASE_EPISODE,
  payload,
})

export {
  updateRepeatState,
  updateShuffleState,
  getCategories,
  saveCategories,
  getSlider,
  saveSlider,
  getStories,
  saveStories,
  loadMoreStories,
  detailStory,
  getEpisodeDetail,
  saveEpisodeDetail,
  getSuggestEpisode,
  saveSuggestEpisode,
  loadMoreSuggestEpisode,
  resetMediaDetail,
  purchaseEpisode
};
