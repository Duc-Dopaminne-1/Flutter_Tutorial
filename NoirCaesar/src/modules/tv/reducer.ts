import { ActionTypes, ITVState, IActionTV } from './index';
import { CommonActionType } from '../base';
import { TabName } from '@src/screens/Home/Television';
import { get } from 'lodash';

const initialState: ITVState = {
  isRepeat: false,
  isShuffle: false,
  categories: [],
};

const reducer = (state: ITVState = initialState, action: IActionTV) => {
  switch (action.type) {
    case ActionTypes.UPDATE_REPEAT_STATE:
      return {
        ...state,
        isRepeat: action.payload.state,
      };
    case ActionTypes.UPDATE_SHUFFLE_STATE:
      return {
        ...state,
        isShuffle: action.payload.state,
      };
    case ActionTypes.SAVE_CATEGORIES:
      return {
        ...state,
        categories: action.payload.results,
      };
    case ActionTypes.SAVE_SLIDER:
      switch (action.payload.type) {
        case TabName.ANIMATION:
          return {
            ...state,
            animation: {
              ...state.animation,
              slider: action.payload.results,
            },
          };
        case TabName.FILM:
          return {
            ...state,
            film: {
              ...state.film,
              slider: action.payload.results,
            },
          };
        case TabName.REVIEWS:
          return {
            ...state,
            reviews: {
              ...state.reviews,
              slider: action.payload.results,
            },
          };
        default:
          return state;
      }
    case ActionTypes.SAVE_STORIES:
      switch (action.payload.type) {
        case TabName.ANIMATION:
          return {
            ...state,
            animation: {
              ...state.animation,
              list: action.payload.results,
            },
          };
        case TabName.FILM:
          return {
            ...state,
            film: {
              ...state.film,
              list: action.payload.results,
            },
          };
        case TabName.REVIEWS:
          return {
            ...state,
            reviews: {
              ...state.reviews,
              list: action.payload.results,
            },
          };
        case TabName.NEWS:
          return {
            ...state,
            news: action.payload.results,
          };
        case TabName.PODCAST:
          return {
            ...state,
            podcast: action.payload.results,
          };
        case TabName.MUSIC:
          return {
            ...state,
            music: action.payload.results,
          };
        default:
          return state;
      }
    case ActionTypes.LOAD_MORE_STORIES:
      switch (action.payload.type) {
        case TabName.ANIMATION:
          const currentAnimationResults = get(state, ['animation', 'list', 'results'], []);
          return {
            ...state,
            animation: {
              ...state.animation,
              list: {
                count: action.payload.results.count,
                next: action.payload.results.next,
                previous: action.payload.results.previous,
                results: [...currentAnimationResults, ...action.payload.results.results],
              },
            },
          };
        case TabName.FILM:
          const currentFilmResults = get(state, ['film', 'list', 'results'], []);
          return {
            ...state,
            film: {
              ...state.film,
              list: {
                count: action.payload.results.count,
                next: action.payload.results.next,
                previous: action.payload.results.previous,
                results: [...currentFilmResults, ...action.payload.results.results],
              },
            },
          };
        case TabName.REVIEWS:
          const currentReviewsResults = get(state, ['reviews', 'list', 'results'], []);
          return {
            ...state,
            reviews: {
              ...state.reviews,
              list: {
                count: action.payload.results.count,
                next: action.payload.results.next,
                previous: action.payload.results.previous,
                results: [...currentReviewsResults, ...action.payload.results.results],
              },
            },
          };
        case TabName.NEWS:
          const currentNewsResults = get(state, ['news', 'results'], []);
          return {
            ...state,
            news: {
              count: action.payload.results.count,
              next: action.payload.results.next,
              previous: action.payload.results.previous,
              results: [...currentNewsResults, ...action.payload.results.results],
            },
          };
        case TabName.PODCAST:
          const currentPodcastResults = get(state, ['podcast', 'results'], []);
          return {
            ...state,
            podcast: {
              count: action.payload.results.count,
              next: action.payload.results.next,
              previous: action.payload.results.previous,
              results: [...currentPodcastResults, ...action.payload.results.results],
            },
          };
        case TabName.MUSIC:
          const currentMusicResults = get(state, ['music', 'results'], []);
          return {
            ...state,
            music: {
              count: action.payload.results.count,
              next: action.payload.results.next,
              previous: action.payload.results.previous,
              results: [...currentMusicResults, ...action.payload.results.results],
            },
          };
        default:
          return state;
      }
    case ActionTypes.SAVE_EPISODE_DETAIL:
      return {
        ...state,
        episodeDetail: action.payload.results,
      };
    case ActionTypes.SAVE_SUGGEST_EPISODE:
      return {
        ...state,
        suggestEpisode: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_SUGGEST_EPISODE:
      const currentSuggestEpisodeResults = get(state, ['suggestEpisode', 'results'], []);
      return {
        ...state,
        suggestEpisode: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...currentSuggestEpisodeResults, ...action.payload.results.results],
        },
      };
    case ActionTypes.RESET_MEDIA_DETAIL:
      return {
        ...state,
        episodeDetail: initialState,
        suggestEpisode: initialState,
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
