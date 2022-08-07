import { ActionTypes, IChatMessageState, IActionChatMessage, IListChatMessageState, IPhotoSize } from './index';
import { CommonActionType } from '@src/modules/base';
import { clone, merge } from 'lodash';
import { WIDTH_RATIO, WIDTH } from '@src/constants/vars';
import { IChannelMessage } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';

const sortList = (listChannelMessage: IChannelMessage[]) => {
  listChannelMessage.sort((a, b) => Date.parse(b.modified.toString()) - Date.parse(a.modified.toString()));
}

const mergeArrays = (arr1: IChannelMessage[], arr2: IChannelMessage[]) => {
  let mergeResult = clone(arr1);
  arr2.forEach((chnMessage: IChannelMessage) => {
    mergeResult = mergeObjectToArray(mergeResult, chnMessage);
  });
  return mergeResult;
}

const mergeObjectToArray = (arr: IChannelMessage[], object: IChannelMessage) => {
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

const reducer = (state: IListChatMessageState = {}, action: IActionChatMessage) => {
  switch (action.type) {
    case ActionTypes.SAVE_MESSAGE_LIST:
    case ActionTypes.LOAD_MORE_MESSAGE_LIST:
    case ActionTypes.SAVE_SENT_MESSAGE:
    case ActionTypes.SAVE_IMAGE_SIZE:
      return {
        ...state,
        [action.payload.channelId]: handleReducer(state[action.payload.channelId], action),
      };
    case ActionTypes.SAVE_MESSAGE_DETAIL:
    case ActionTypes.SAVE_UPDATED_MESSAGE:
    case ActionTypes.SAVE_UPDATED_MESSAGE:
    case ActionTypes.SAVE_DELETED_MESSAGE:
    case CommonActionType.RESET_ALL_STATE:
      return initialState;
    default:
      return state;
  }
};

const initialState: IChatMessageState = {
  messageList: {
    count: 0,
    results: [],
  },
  photoSizeList: {}
};

const handleReducer = (state: IChatMessageState = initialState, action: IActionChatMessage) => {
  switch (action.type) {
    case ActionTypes.SAVE_MESSAGE_LIST:
      return {
        ...state,
        messageList: action.payload.results,
      };
    case ActionTypes.LOAD_MORE_MESSAGE_LIST:
      const mergeLoadMore = mergeArrays(state.messageList.results, action.payload.results.results);
      sortList(mergeLoadMore);

      return {
        ...state,
        messageList: {
          ...action.payload.results,
          results: mergeLoadMore
        }
      };
    case ActionTypes.SAVE_SENT_MESSAGE:
      const mergeListMessage = mergeObjectToArray(state.messageList.results, action.payload.results);
      sortList(mergeListMessage);

      return {
        ...state,
        messageList: {
          ...state.messageList,
          results: mergeListMessage,
        },
      };
    case ActionTypes.SAVE_IMAGE_SIZE:
      return {
        ...state,
        photoSizeList: {
          ...state.photoSizeList,
          [action.payload.messageId]: photoReducer(state.photoSizeList[action.payload.messageId], action)
        }
      }
    case ActionTypes.SAVE_MESSAGE_DETAIL:
    case ActionTypes.SAVE_UPDATED_MESSAGE:
    case ActionTypes.SAVE_UPDATED_MESSAGE:
    case ActionTypes.SAVE_DELETED_MESSAGE:
    default:
      return state;
  }
};

const photoInitialState: IPhotoSize = {
  width: ((WIDTH - 30) / 2) * WIDTH_RATIO,
  height: ((WIDTH - 30) / 2) * WIDTH_RATIO
}

const photoReducer = (state: IPhotoSize = photoInitialState, action: IActionChatMessage) => {
  switch (action.type) {
    case ActionTypes.SAVE_IMAGE_SIZE:
      const width = action.payload.width;
      const height = action.payload.height;
      return {
        ...state,
        width: width > height ? (((WIDTH - 30) * 2) / 3) * WIDTH_RATIO : ((WIDTH - 30) / 2) * WIDTH_RATIO,
        height: width > height ? (((height / width) * (WIDTH - 30) * 2) / 3) * WIDTH_RATIO : (((height / width) * (WIDTH - 30)) / 2) * WIDTH_RATIO
      }
    default:
      return state;
  }
};

export default reducer;
