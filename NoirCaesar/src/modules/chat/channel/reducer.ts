import { ActionTypes, IChatChannelState, IActionChatChannel } from './index';
import { CommonActionType } from '@src/modules/base';
import { clone, merge, assign, map, find } from 'lodash';
import { MessageType, ChannelType, IChannel } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';

const initialState: IChatChannelState = {
  channelList: {
    count: 0,
    results: [],
  },
  friendList: {
    count: 0,
    results: [],
  },
  participantList: {
    count: 0,
    results: [],
  },
};

const sortList = (listChannel: IChannel[]) => {
  listChannel.sort((a, b) => Date.parse(b.last_message_time) - Date.parse(a.last_message_time));
}

const mergeArrays = (arr1: IChannel[], arr2: IChannel[]) => {
  let mergeResult = clone(arr1);
  arr2.forEach((chnMessage: IChannel) => {
    mergeResult = mergeObjectToArray(mergeResult, chnMessage);
  });
  return mergeResult;
}

const mergeObjectToArray = (arr: IChannel[], object: IChannel) => {
  const isExist = arr.filter(it => it.id === object.id).length > 0;
  if (!isExist) return [object, ...arr];

  const mergeResult = arr.map(obj => {
    if (obj.id === object.id) {
      return { ...obj, ...object };
    }
    return obj;
  });
  return mergeResult;
};

const reducer = (state: IChatChannelState = initialState, action: IActionChatChannel) => {
  switch (action.type) {
    case ActionTypes.SAVE_CHANNEL_LIST:
      return {
        ...state,
        channelList: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_CHANNEL_LIST:
      const mergeLoadMore = mergeArrays(state.channelList.results, action.payload.results.results);
      sortList(mergeLoadMore);

      return {
        ...state,
        channelList: {
          ...action.payload.results,
          results: mergeLoadMore,
        },
      };
    case ActionTypes.SAVE_CHANNEL_DETAIL:
      return {
        ...state,
        channel: action.payload.results,
      };
    case ActionTypes.SAVE_CREATED_CHANNEL:
      const existedChannel = state.channelList.results.find(item => item.id === action.payload.results.id);
      return {
        ...state,
        channelList: {
          ...state.channelList,
          results: existedChannel ? [...state.channelList.results] : [action.payload.results, ...state.channelList.results],
        },
      };
    case ActionTypes.SAVE_UPDATED_CHANNEL:
      const mergeListChannel = mergeObjectToArray(state.channelList.results, action.payload.results);
      sortList(mergeListChannel);

      return {
        ...state,
        channelList: { results: mergeListChannel },
      };
    case ActionTypes.SAVE_FRIEND_LIST:
      return {
        ...state,
        friendList: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_FRIEND_LIST:
      return {
        ...state,
        friendList: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.friendList.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_PARTICIPANT_LIST:
      return {
        ...state,
        participantList: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_PARTICIPANT_LIST:
      return {
        ...state,
        participantList: {
          count: action.payload.results.count,
          next: action.payload.results.next,
          previous: action.payload.results.previous,
          results: [...state.participantList.results, ...action.payload.results.results],
        },
      };
    case ActionTypes.SAVE_DELETED_CHANNEL:
    case ActionTypes.SAVE_LEFT_CHANNEL:
      return {
        ...state,
        channelList: {
          ...state.channelList,
          results: state.channelList.results.filter(item => item.id !== action.payload.results.id),
        },
      };
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

export default reducer;
