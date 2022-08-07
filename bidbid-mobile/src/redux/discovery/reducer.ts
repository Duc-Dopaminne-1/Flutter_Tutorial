import { DiscoveryActionTypes, DiscoveryAction, DISCOVERY } from './index';
import { TypeFindProfiles } from '@/models/findProfiles';

export interface DiscoveryData {
  index: number;
  data: DISCOVERY[];
  indexLoadMore: number[];
  triggerEndTime: number;
  shouldHideLoading: boolean;
  spinnerCover: boolean;
  likedIds: string[];
  detail: {
    [userId: string]: DISCOVERY;
  };
}

const initialState: DiscoveryData = {
  index: 0,
  indexLoadMore: [],
  data: [],
  shouldHideLoading: false,
  triggerEndTime: 0,
  likedIds: [],
  detail: {},
  spinnerCover: true,
};

const reducer = (state: DiscoveryData = initialState, action: DiscoveryAction) => {
  // console.log('*****', action.type);
  switch (action.type) {
    case DiscoveryActionTypes.SHOW_DISCOVERY_LOADING:
      return {
        ...state,
        spinnerCover: false,
        shouldHideLoading: false,
      };
    case DiscoveryActionTypes.HIDE_DISCOVERY_LOADING:
      return {
        ...state,
        spinnerCover: true,
        shouldHideLoading: true,
      };
    case DiscoveryActionTypes.SET_INDEX_DISCOVERY:
      if (action.payload.index === 0) {
        /**
         * Reset index and filter all liked items from data when all swiped
         */
        if (action.payload?.findProfiles?.length === 1) {
          // remove all profile disliked when filter find profiles
          if (action.payload?.findProfiles[0].type === TypeFindProfiles.FOLLOWED) {
            return {
              ...state,
              index: 0,
              data: state.data.filter(item => state.likedIds.find(id => id === item.id)),
            };
          } else {
            // remove all profile liked when filter find profiles
            return {
              ...state,
              index: 0,
              data: state.data.filter(item => !state.likedIds.find(id => id === item.id)),
            };
          }
        }

        return {
          ...state,
          index: 0,
          data: action.payload.noReset ? state.data : state.data.filter(item => !state.likedIds.find(id => id === item.id)),
        };
      }
      return {
        ...state,
        index: action.payload.index % state.data.length,
      };
    case DiscoveryActionTypes.SAVE_DISCOVERY:
      return {
        ...state,
        data: action.payload.data,
        shouldHideLoading: true,
      };
    case DiscoveryActionTypes.SAVE_DISCOVERY_WITH_FILTER:
      return {
        ...state,
        index: 0,
        indexLoadMore: [],
        data: action.payload.data,
      };
    case DiscoveryActionTypes.SAVE_DISCOVERY_DETAIL:
      return {
        ...state,
        detail: state.detail
          ? {
              ...state.detail,
              [action.payload.userId]: action.payload.data,
            }
          : {
              [action.payload.userId]: action.payload.data,
            },
      };
    case DiscoveryActionTypes.LIKE_DISCOVERY:
      return {
        ...state,
        likedIds: [...state.likedIds, action.payload.userId],
        data: action.payload.isLiked
          ? state.data
          : state.data.map(item =>
              item.id === action.payload.userId
                ? {
                    ...item,
                    likes: item.likes + 1,
                    rates: item?.rates?.find(i => i.ratedById === action.payload.userAuthId)
                      ? item.rates.map(i => (i.ratedById === action.payload.userAuthId ? { ...i, score: '1.0' } : i))
                      : [{ ratedById: action.payload.userAuthId, score: '1.0' }],
                  }
                : item,
            ),
      };
    case DiscoveryActionTypes.UN_LIKE_DISCOVERY:
      return {
        ...state,
        likedIds: state.likedIds.filter(ids => ids !== action.payload.userId),
        data: !action.payload.isLiked
          ? state.data
          : state.data.map(item =>
              item.id === action.payload.userId
                ? {
                    ...item,
                    likes: item.likes - 1,
                    rates: item?.rates?.find(i => i.ratedById === action.payload.userAuthId)
                      ? item.rates.map(i => (i.ratedById === action.payload.userAuthId ? { ...i, score: '0.0' } : i))
                      : [{ ratedById: action.payload.userAuthId, store: '0.0' }],
                  }
                : item,
            ),
      };
    case DiscoveryActionTypes.REVERT_LIKE_DISCOVERY:
      return {
        ...state,
        likedIds: state.likedIds.filter(ids => ids !== action.payload.userId),
      };
    case DiscoveryActionTypes.BID_MAX:
      const result = state.data.filter(item => item.id !== action.payload.userId);
      return {
        ...state,
        index: state.index - 1 < 0 ? 0 : state.index - 1,
        data: result,
      };
    case DiscoveryActionTypes.INCREASE_INDEX:
      return {
        ...state,
        index: state.data.length - 1 === state.index ? 0 : state.index + 1,
      };
    case DiscoveryActionTypes.TRIGGER_END_TIME:
      return {
        ...state,
        triggerEndTime: state.triggerEndTime + 1,
      };
    case DiscoveryActionTypes.LOG_OUT:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
