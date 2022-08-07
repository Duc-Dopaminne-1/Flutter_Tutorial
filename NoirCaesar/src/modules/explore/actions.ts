import {
  ActionTypes,
  IActionGetEpisodeListPayload,
  IActionSaveEpisodeListPayload,
  IActionLoadMoreEpisodeListPayload,
  IActionGetSuggestExploreListPayload,
  IActionGetExploreListPayload,
  IActionSaveExploreListPayload,
  IActionLoadMoreExploreListPayload,
  IActionSaveExploreSliderPayload,
} from './index';
import { IActionCallback } from '../base';

const getEpisodeList = (payload: IActionGetEpisodeListPayload) => ({
  type: ActionTypes.EPISODE_LIST,
  payload,
});

const saveEpisodeList = (payload: IActionSaveEpisodeListPayload) => ({
  type: ActionTypes.SAVE_EPISODE_LIST,
  payload,
});

const saveExploreList = (payload: IActionSaveExploreListPayload) => ({
  type: ActionTypes.SAVE_EXPLORE_LIST,
  payload,
});

const loadMoreEpisodeList = (payload: IActionLoadMoreEpisodeListPayload) => ({
  type: ActionTypes.LOAD_MORE_EPISODE_LIST,
  payload,
});

const loadMoreExploreList = (payload: IActionLoadMoreExploreListPayload) => ({
  type: ActionTypes.LOAD_MORE_EXPLORE_LIST,
  payload,
});

const getSuggestExploreList = (payload: IActionGetSuggestExploreListPayload) => ({
  type: ActionTypes.GET_SUGGESTION_EXPLORE,
  payload,
});

const getExploreList = (payload: IActionGetExploreListPayload) => ({
  type: ActionTypes.EXPLORE_LIST,
  payload,
});

const clearExploreList = () => ({
  type: ActionTypes.CLEAR_EXPLORE_LIST,
});

const getExploreSlider = (payload: IActionCallback) => ({
  type: ActionTypes.GET_EXPLORE_SLIDER,
  payload
})

const saveExploreSlider = (payload: IActionSaveExploreSliderPayload) => ({
  type: ActionTypes.SAVE_EXPLORE_SLIDER,
  payload
})

export {
  getEpisodeList,
  saveEpisodeList,
  loadMoreEpisodeList,
  getSuggestExploreList,
  getExploreList,
  saveExploreList,
  loadMoreExploreList,
  clearExploreList,
  getExploreSlider,
  saveExploreSlider
};
